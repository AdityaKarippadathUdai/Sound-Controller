package com.aditya.silentmode

import com.facebook.react.bridge.*

class BackgroundServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BackgroundService"
    }

    @ReactMethod
    fun startService(promise: Promise) {
        promise.resolve(null)
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        promise.resolve(null)
    }

    @ReactMethod
    fun requestIgnoreBatteryOptimizations(promise: Promise) {
        promise.resolve(null)
    }
}