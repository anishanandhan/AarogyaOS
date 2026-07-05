# AarogyaOS Citizen App (Flutter Mobile)

This directory contains the mobile-client implementation of AarogyaOS tailored for citizen usage, built using **Flutter**.

## 🚀 Key Features
* **Cross-Platform:** Targets native execution for both Android and iOS devices.
* **Multimodal AI Triage:** Sends captured visual patient symptom logs (rashes, infections) to our live serverless Cloud Run API (`/api/v1/triage`) powered by Gemini 1.5 Flash.
* **Low-connectivity Buffering:** Caches local state using shared preferences to queue records for automatic sync when network signals return.

## 🛠️ Installation
1. Install the Flutter SDK: https://docs.flutter.dev/get-started/install
2. Run `flutter pub get` inside this directory to load dependencies.
3. Run `flutter run` to launch on a connected device or emulator.
