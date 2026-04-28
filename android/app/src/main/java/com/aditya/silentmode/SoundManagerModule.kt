package com.aditya.silentmode

import android.content.Context
import android.media.AudioManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SoundManagerModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SoundManager"

  @ReactMethod
  fun setMode(mode: String, promise: Promise) {
    try {
      val audioManager =
        reactApplicationContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager

      audioManager.ringerMode = when (mode) {
        "silent" -> AudioManager.RINGER_MODE_SILENT
        "vibrate" -> AudioManager.RINGER_MODE_VIBRATE
        "normal" -> AudioManager.RINGER_MODE_NORMAL
        else -> AudioManager.RINGER_MODE_NORMAL
      }

      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SOUND_MODE_ERROR", "Unable to set sound mode", error)
    }
  }

  @ReactMethod
  fun setSilent(promise: Promise) {
    setMode("silent", promise)
  }

  @ReactMethod
  fun setVibrate(promise: Promise) {
    setMode("vibrate", promise)
  }

  @ReactMethod
  fun setNormal(promise: Promise) {
    setMode("normal", promise)
  }
}
