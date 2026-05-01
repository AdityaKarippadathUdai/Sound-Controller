# 📱 Silent Mode Scheduler

Automatically control your phone’s sound mode based on custom schedules.

---

## 🚀 Overview

Silent Mode Scheduler is an Android automation app that allows users to **schedule sound profiles (Silent, Vibrate, Normal)** based on time and day. It works offline and is designed for reliability using native Android capabilities.

---

## ✨ Features

- 🔕 Schedule **Silent / Vibrate / Normal** modes  
- 📅 Select specific days for each schedule  
- ⏰ Time-based automation (supports overnight ranges)  
- ⚡ Works offline (no internet required)  
- 🎯 Real-time schedule detection  
- 🧠 Smart scheduler with conflict handling  
- 📱 Clean and minimal UI  

---

## 📸 Screenshots



### 🏠 Home Screen
![Home](Screenshots/5.png)

### ⏰ Create / Edit Schedule
![Edit](Screenshots/4.png)

### ⚙️ Settings Screen
![Settings](Screenshots/3.png)

### ⚙️ Settings Screen Light Mode
![Settings](Screenshots/1.png)

### ⏰ Create / Edit Schedule Light Mode
![Settings](Screenshots/2.png)

### ⚙️ Permissions Required Screen
![Settings](Screenshots/6.png)

---


## 🧠 How It Works

1. Create a schedule with:
   - Start time
   - End time
   - Days
   - Mode (Silent / Vibrate / Normal)

2. The scheduler continuously checks:
   - Current time
   - Active schedules

3. When conditions match:
   - The app automatically changes the phone's sound mode

---

## ⚙️ Tech Stack

- **React Native (Expo Bare Workflow)**
- **TypeScript**
- **SQLite (Local Storage)**
- **Android Native Modules (Kotlin)**
- **Expo Modules API**

---

## 🔐 Permissions Required

This app requires the following permissions:

### 1. Do Not Disturb (DND) Access
Required to change sound modes programmatically.

### 2. Modify Audio Settings
Allows changing ringer mode.

### 3. Battery Optimization Exemption
Ensures background execution works reliably.

---

## 📦 Installation

### 🔹 Option 1: Install APK

1. Download `app-release.apk` from GitHub Releases  
2. Install on your Android device  
3. Grant required permissions  

---

### 🔹 Option 2: Build from Source

```bash
git clone https://github.com/AdityaKarippadathUdai/Sound-Controller
cd silent-mode-scheduler
npm install
npx expo prebuild
npx expo run:android