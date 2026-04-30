package com.aditya.silentmode

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BackgroundServiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BackgroundService"

    @ReactMethod
    fun startService(promise: Promise) {
        try {
            val intent = Intent(reactContext, SchedulerService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent)
            } else {
                reactContext.startService(intent)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("START_SERVICE_FAILED", e)
        }
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            val intent = Intent(reactContext, SchedulerService::class.java)
            reactContext.stopService(intent)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("STOP_SERVICE_FAILED", e)
        }
    }

    @ReactMethod
    fun requestIgnoreBatteryOptimizations(promise: Promise) {
        try {
            val pm = reactContext.getSystemService(android.content.Context.POWER_SERVICE) as PowerManager
            val packageName = reactContext.packageName
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                !pm.isIgnoringBatteryOptimizations(packageName)
            ) {
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = Uri.parse("package:$packageName")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                reactContext.startActivity(intent)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            // Non-fatal: some OEMs don't expose this setting
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun isIgnoringBatteryOptimizations(promise: Promise) {
        try {
            val pm = reactContext.getSystemService(android.content.Context.POWER_SERVICE) as PowerManager
            val packageName = reactContext.packageName
            val isIgnoring = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                pm.isIgnoringBatteryOptimizations(packageName)
            } else {
                true
            }
            promise.resolve(isIgnoring)
        } catch (e: Exception) {
            promise.reject("CHECK_BATTERY_FAILED", e)
        }
    }
}