package com.aditya.silentmode

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.database.sqlite.SQLiteDatabase
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import java.util.Calendar

class SchedulerService : Service() {

    companion object {
        private const val TAG = "SchedulerService"
        private const val CHANNEL_ID = "scheduler_channel"
        private const val NOTIFICATION_ID = 1001
        private const val TICK_INTERVAL_MS = 30_000L
    }

    private val handler = Handler(Looper.getMainLooper())
    private val tickRunnable = object : Runnable {
        override fun run() {
            runSchedulerTick()
            handler.postDelayed(this, TICK_INTERVAL_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
        Log.i(TAG, "SchedulerService started")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        handler.removeCallbacks(tickRunnable)
        handler.post(tickRunnable)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(tickRunnable)
        Log.i(TAG, "SchedulerService destroyed")
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // ------------------------------------------------------------------
    // Scheduler logic
    // ------------------------------------------------------------------

    private fun runSchedulerTick() {
        try {
            val schedules = querySchedules()
            val now = Calendar.getInstance()
            val currentDay = getDayAbbr(now.get(Calendar.DAY_OF_WEEK))
            val currentMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)

            Log.d(TAG, "Tick: day=$currentDay minutes=$currentMinutes schedules=${schedules.size}")

            val active = schedules.firstOrNull { s ->
                s.isEnabled &&
                s.days.contains(currentDay) &&
                isInRange(currentMinutes, s.startMinutes, s.endMinutes)
            }

            if (active != null) {
                Log.i(TAG, "Applying mode=${active.mode} from schedule id=${active.id}")
                applyMode(active.mode)
                updateNotification("Active: ${active.mode} (${active.startTime}–${active.endTime})")
            } else {
                Log.d(TAG, "No active schedule")
                updateNotification("Monitoring schedules…")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Scheduler tick error", e)
        }
    }

    private fun applyMode(mode: String) {
        val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        when (mode.lowercase()) {
            "silent"  -> am.ringerMode = AudioManager.RINGER_MODE_SILENT
            "vibrate" -> am.ringerMode = AudioManager.RINGER_MODE_VIBRATE
            "normal"  -> am.ringerMode = AudioManager.RINGER_MODE_NORMAL
        }
    }

    // ------------------------------------------------------------------
    // SQLite
    // ------------------------------------------------------------------

    private data class ScheduleRow(
        val id: String,
        val startTime: String,
        val endTime: String,
        val days: List<String>,
        val mode: String,
        val isEnabled: Boolean,
        val startMinutes: Int,
        val endMinutes: Int,
    )

    private fun querySchedules(): List<ScheduleRow> {
        val dbPath = getDatabasePath("schedules.db").absolutePath
        if (!java.io.File(dbPath).exists()) {
            Log.w(TAG, "DB not found at $dbPath")
            return emptyList()
        }

        val db = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY)
        val result = mutableListOf<ScheduleRow>()

        try {
            val cursor = db.rawQuery(
                "SELECT id, startTime, endTime, days, mode, isEnabled FROM schedules",
                null
            )
            cursor.use {
                while (it.moveToNext()) {
                    val startTime = it.getString(1) ?: continue
                    val endTime   = it.getString(2) ?: continue
                    val daysRaw   = it.getString(3) ?: ""
                    val mode      = it.getString(4) ?: "normal"
                    val enabled   = it.getInt(5) == 1

                    result.add(
                        ScheduleRow(
                            id           = it.getString(0),
                            startTime    = startTime,
                            endTime      = endTime,
                            days         = daysRaw.split(",").map(String::trim).filter(String::isNotEmpty),
                            mode         = mode,
                            isEnabled    = enabled,
                            startMinutes = timeToMinutes(startTime),
                            endMinutes   = timeToMinutes(endTime),
                        )
                    )
                }
            }
        } finally {
            db.close()
        }
        return result
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private fun timeToMinutes(time: String): Int {
        val parts = time.split(":")
        if (parts.size < 2) return 0
        return (parts[0].toIntOrNull() ?: 0) * 60 + (parts[1].toIntOrNull() ?: 0)
    }

    private fun isInRange(current: Int, start: Int, end: Int): Boolean {
        // Overnight range: e.g. 22:00 – 07:00
        return if (start > end) current >= start || current <= end
        else current >= start && current <= end
    }

    private fun getDayAbbr(calendarDay: Int): String = when (calendarDay) {
        Calendar.MONDAY    -> "Mon"
        Calendar.TUESDAY   -> "Tue"
        Calendar.WEDNESDAY -> "Wed"
        Calendar.THURSDAY  -> "Thu"
        Calendar.FRIDAY    -> "Fri"
        Calendar.SATURDAY  -> "Sat"
        Calendar.SUNDAY    -> "Sun"
        else               -> ""
    }

    // ------------------------------------------------------------------
    // Notification
    // ------------------------------------------------------------------

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Schedule Automation",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps the sound scheduler running in background"
                setShowBadge(false)
            }
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(text: String = "Monitoring schedules…") =
        NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Silent Mode Scheduler")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_lock_silent_mode)
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

    private fun updateNotification(text: String) {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        nm.notify(NOTIFICATION_ID, buildNotification(text))
    }
}
