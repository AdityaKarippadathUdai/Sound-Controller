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
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.isNotificationPolicyAccessGranted
      } else {
        true
      }
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

      Log.d("SoundManager", "Setting mode: $mode")

      try {
        when (mode.lowercase()) {
          "silent"  -> audioManager.ringerMode = AudioManager.RINGER_MODE_SILENT
          "vibrate" -> audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
          "normal"  -> audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
          else      -> Log.w("SoundManager", "Unknown mode: $mode")
        }
      } catch (e: SecurityException) {
        Log.e("SoundManager", "Permission denied: ${e.message}")
      }
      true
    }
  }
}
