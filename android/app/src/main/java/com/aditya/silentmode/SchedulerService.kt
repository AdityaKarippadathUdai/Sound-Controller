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
        Log.i(TAG, "SchedulerService started - VERSION 2.0 (Native DB Fix)")
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

            Log.d(TAG, "--- Scheduler Tick Start ---")
            Log.d(TAG, "Time: $currentDay ${now.get(Calendar.HOUR_OF_DAY)}:${now.get(Calendar.MINUTE)} ($currentMinutes mins)")
            Log.d(TAG, "Total schedules loaded: ${schedules.size}")

            val active = schedules.filter { s ->
                val inRange = isInRange(currentMinutes, s.startMinutes, s.endMinutes)
                val dayMatch = s.days.contains(currentDay)
                
                Log.v(TAG, "Checking schedule: ${s.id} [${s.startTime}-${s.endTime}] " +
                    "enabled=${s.isEnabled} dayMatch=$dayMatch inRange=$inRange " +
                    "(cur=$currentMinutes, start=${s.startMinutes}, end=${s.endMinutes})")
                
                s.isEnabled && dayMatch && inRange
            }.sortedWith(Comparator { a, b ->
                // Priority 1: Specificity (fewer days = more specific)
                val daysDiff = a.days.size.compareTo(b.days.size)
                if (daysDiff != 0) return@Comparator daysDiff

                // Priority 2: Recency (newer created = higher priority)
                val createdDiff = b.createdAt.compareTo(a.createdAt)
                if (createdDiff != 0) return@Comparator createdDiff

                // Priority 3: Mode strength
                fun modeValue(mode: String) = when (mode.lowercase()) {
                    "silent" -> 3
                    "vibrate" -> 2
                    else -> 1
                }
                modeValue(b.mode).compareTo(modeValue(a.mode))
            }).firstOrNull()

            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val currentActualMode = am.ringerMode
            Log.d(TAG, "Current System RingerMode: $currentActualMode")

            if (active != null) {
                val expectedMode = when (active.mode.lowercase()) {
                    "silent" -> if (isDndAccessGranted()) AudioManager.RINGER_MODE_SILENT else AudioManager.RINGER_MODE_VIBRATE
                    "vibrate" -> AudioManager.RINGER_MODE_VIBRATE
                    else -> AudioManager.RINGER_MODE_NORMAL
                }

                Log.i(TAG, "Active Schedule Found: ${active.id} [${active.mode}]. Expected System Mode: $expectedMode")

                if (currentActualMode != expectedMode) {
                    Log.i(TAG, "APPLYING MODE: ${active.mode} (Reason: Schedule active)")
                    applyMode(active.mode)
                    Log.d(TAG, "RingerMode after apply: ${am.ringerMode}")
                }
                updateNotification("Active: ${active.mode} (${active.startTime}–${active.endTime})")
            } else {
                Log.d(TAG, "No active schedule found for current time.")
                // REVERT TO NORMAL if not already normal
                if (currentActualMode != AudioManager.RINGER_MODE_NORMAL) {
                    Log.i(TAG, "REVERTING TO NORMAL: No schedule active")
                    applyMode("normal")
                }
                updateNotification("Monitoring schedules…")
            }
            Log.d(TAG, "--- Scheduler Tick End ---")
        } catch (e: Exception) {
            Log.e(TAG, "Scheduler tick error", e)
        }
    }

    private fun applyMode(mode: String) {
        val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val modeToSet = mode.lowercase()
        val hasDnd = isDndAccessGranted()

        try {
            if (modeToSet == "silent" && !hasDnd) {
                Log.w(TAG, "Silent mode requested but DND access not granted. Falling back to vibrate.")
                am.ringerMode = AudioManager.RINGER_MODE_VIBRATE
            } else {
                when (modeToSet) {
                    "silent"  -> am.ringerMode = AudioManager.RINGER_MODE_SILENT
                    "vibrate" -> am.ringerMode = AudioManager.RINGER_MODE_VIBRATE
                    "normal"  -> am.ringerMode = AudioManager.RINGER_MODE_NORMAL
                }
            }
        } catch (e: SecurityException) {
            Log.e(TAG, "Permission denied setting mode: ${e.message}")
            if (modeToSet == "silent") {
                try {
                    am.ringerMode = AudioManager.RINGER_MODE_VIBRATE
                } catch (e2: Exception) {
                    Log.e(TAG, "Failed fallback to vibrate: ${e2.message}")
                }
            }
        }
    }

    private fun isDndAccessGranted(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.isNotificationPolicyAccessGranted
        } else {
            true
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
        val createdAt: Long,
    )

    private fun querySchedules(): List<ScheduleRow> {
        // Expo-sqlite (next) stores databases in the 'files/SQLite' directory
        val dbFile = java.io.File(filesDir, "SQLite/schedules.db")
        val dbPath = dbFile.absolutePath
        
        if (!dbFile.exists()) {
            Log.w(TAG, "DB not found at $dbPath. Trying legacy path...")
            val legacyDb = getDatabasePath("schedules.db")
            if (!legacyDb.exists()) {
                Log.e(TAG, "Database not found in any known location!")
                return emptyList()
            }
            Log.i(TAG, "Found legacy DB at ${legacyDb.absolutePath}")
            return querySchedulesFromPath(legacyDb.absolutePath)
        }

        return querySchedulesFromPath(dbPath)
    }

    private fun querySchedulesFromPath(dbPath: String): List<ScheduleRow> {
        val db = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY)
        val result = mutableListOf<ScheduleRow>()

        try {
            val cursor = db.rawQuery(
                "SELECT id, startTime, endTime, days, mode, isEnabled, createdAt FROM schedules",
                null
            )
            cursor.use {
                val idIdx = it.getColumnIndex("id")
                val startIdx = it.getColumnIndex("startTime")
                val endIdx = it.getColumnIndex("endTime")
                val daysIdx = it.getColumnIndex("days")
                val modeIdx = it.getColumnIndex("mode")
                val enabledIdx = it.getColumnIndex("isEnabled")
                val createdIdx = it.getColumnIndex("createdAt")

                while (it.moveToNext()) {
                    val startTime = it.getString(startIdx) ?: continue
                    val endTime   = it.getString(endIdx) ?: continue
                    val daysRaw   = it.getString(daysIdx) ?: ""
                    val mode      = it.getString(modeIdx) ?: "normal"
                    val enabled   = it.getInt(enabledIdx) == 1
                    val createdAt = if (createdIdx != -1) it.getLong(createdIdx) else 0L

                    result.add(
                        ScheduleRow(
                            id           = it.getString(idIdx),
                            startTime    = startTime,
                            endTime      = endTime,
                            days         = daysRaw.split(",").map(String::trim).filter(String::isNotEmpty),
                            mode         = mode,
                            isEnabled    = enabled,
                            startMinutes = timeToMinutes(startTime),
                            endMinutes   = timeToMinutes(endTime),
                            createdAt    = createdAt,
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
