#!/bin/bash

echo "Building for release for Android...."

rm smartvan.apk

ionic build --release android


jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore demo-key.keystore -storepass rexelapps platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk demo-key

/Users/kbandi/Library/Android/sdk/build-tools/28.0.3/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk smartvan.apk
