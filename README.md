# risebox-app: Your Risebox mobile assistant

### Contents
- [Installation](#install)
- [Push Notifications](#push)

##<a name="install"></a> Installation
0. Prerequisites:
  * Node.js
  * Npm

1. Install Cordova & Ionic Framework
  ```
  sudo npm install -g cordova ionic
  ```

2. Clone repo from github
  ```
  git clone git@github.com:risebox/risebox-app.git
  ```

3. Add Android & IOS platforms
  ```
  cd risebox-app
  ionic platform add ios
  ionic platform add android
  ```

4. Build and run risebox-app
  First try using Ionic view
  ```
  ionic serve --lab
  ```
  Then try using emulators
  ```
  ionic emulate android
  ionic emulate ios
  ```
  If you don't have iOS simulator available from command line, run this:
  ```
  npm install -g ios-sim
  ```

##<a name="push"></a> Push Notifications

There is an issue with PushPlugin 2.5.0.
If you see this error while building
```
UNEXPECTED TOP-LEVEL EXCEPTION:
com.android.dex.DexException: Multiple dex files define Landroid/support/v4/app/NotificationCompatHoneycomb;
```
Then you should follow advice here:
https://github.com/phonegap-build/PushPlugin/issues/594

=> At the end of platforms/android/build.gradle put this
configurations {
all*.exclude group: 'com.android.support', module: 'support-v4'
}