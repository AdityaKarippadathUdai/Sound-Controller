package com.aditya.soundmanager

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import android.provider.Settings
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SoundManagerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SoundManager")

    Function("hasDndAccess") {
      val context = appContext.reactContext ?: return@Function false
      isDndAccessGranted(context)
    }

    Function("requestDndAccess") {
      val context = appContext.reactContext ?: return@Function false
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        val intent = Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
      }
      true
    }

    Function("setMode") { mode: String ->
      val context = appContext.reactContext ?: return@Function false
      val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager

      Log.d("SoundManager", "Requested mode: $mode")
      
      val modeToSet = mode.lowercase()
      val hasDnd = isDndAccessGranted(context)
      Log.d("SoundManager", "DND access granted: $hasDnd")

      try {
        if (modeToSet == "silent" && !hasDnd) {
          Log.w("SoundManager", "Silent mode requested but DND access not granted. Falling back to vibrate.")
          audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
        } else {
          when (modeToSet) {
            "silent"  -> audioManager.ringerMode = AudioManager.RINGER_MODE_SILENT
            "vibrate" -> audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
            "normal"  -> audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
            else      -> Log.w("SoundManager", "Unknown mode: $modeToSet")
          }
        }
        Log.d("SoundManager", "Current ringer mode after attempt: ${audioManager.ringerMode}")
      } catch (e: SecurityException) {
        Log.e("SoundManager", "Permission denied setting mode: ${e.message}")
        if (modeToSet == "silent") {
           Log.d("SoundManager", "SecurityException caught. Falling back to vibrate.")
           try {
             audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
           } catch (e2: Exception) {
             Log.e("SoundManager", "Failed to fallback to vibrate: ${e2.message}")
           }
        }
      }
      true
    }
  }

  private fun isDndAccessGranted(context: Context): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      notificationManager.isNotificationPolicyAccessGranted
    } else {
      true
    }
  }
}
