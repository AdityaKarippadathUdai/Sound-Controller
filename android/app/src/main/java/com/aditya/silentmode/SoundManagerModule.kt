package com.aditya.silentmode

import android.content.Context
import android.media.AudioManager
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SoundManagerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SoundManager"
    }

    @ReactMethod
    fun setMode(mode: String, promise: Promise) {
        try {
            Log.d("SoundManager", "Setting mode: $mode")

            val audioManager =
                reactApplicationContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager

            when (mode.lowercase()) {
                "silent" -> audioManager.ringerMode = AudioManager.RINGER_MODE_SILENT
                "vibrate" -> audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
                "normal" -> audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
                else -> {
                    Log.d("SoundManager", "Unknown mode: $mode")
                    promise.reject("INVALID_MODE", "Unknown sound mode: $mode")
                    return
                }
            }

            promise.resolve(null)
        } catch (error: SecurityException) {
            Log.e("SoundManager", "Permission denied while setting mode: $mode", error)
            promise.reject("PERMISSION_DENIED", error)
        } catch (error: Exception) {
            Log.e("SoundManager", "Failed to set mode: $mode", error)
            promise.reject("SET_MODE_FAILED", error)
        }
    }
}
