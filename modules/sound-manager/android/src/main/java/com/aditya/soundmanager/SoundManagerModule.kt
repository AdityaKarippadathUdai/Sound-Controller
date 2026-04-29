package com.aditya.soundmanager

import android.content.Context
import android.media.AudioManager
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SoundManagerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SoundManager")

    Function("setMode") { mode: String ->
      val context = appContext.reactContext ?: return@Function
      val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager

      Log.d("SoundManager", "Setting mode: $mode")

      when (mode.lowercase()) {
        "silent"  -> audioManager.ringerMode = AudioManager.RINGER_MODE_SILENT
        "vibrate" -> audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
        "normal"  -> audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
        else      -> Log.w("SoundManager", "Unknown mode: $mode")
      }
    }
  }
}
