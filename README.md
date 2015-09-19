# risebox-app: Your Risebox mobile assistant

### Contents
- [Installation](#install)
- [Android Provision](#android_provision)
- [iOS Provision](#ios_provision)
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

4. Configure risebox-app
  Configure your app with right env variables
  ```
  conf
  # or
  ./tools/config.sh # uses env matching current branch


4. Build and run risebox-app
  ```
  bu
  # or
  ./tools/build.sh

  ```
  This will create the __www/js/config/env-config.js__ with angular constants ued by the app

  Then try using Ionic view
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

5. Run app
  * On Android:
  ```
  ionic run android
  ```

  * On iOS:
  First you need to install ios-deploy
  ```
  sudo npm install -g ios-deploy
  ```

  Then you run on device, list devices and choose to deploy on one
  ```
  ionic run ios --device
  ionic run ios --list
  ionic run ios --target="iPhone-6"
  ```

##<a name="android_provision"></a> Android provisionning

Simply follow instructions from [Ionic docs](http://docs.ionic.io/docs/push-android-setup)

##<a name="ios_provision"></a> iOS provisionning

0. Create certificate request CSR (if necessary)
  * You need to generate a certificate signing request file (CSR). This is used to authenticate the creation of an SSL certificate.
  * Launch __Keychain Access__ on your Mac
    * Navigate to __Keychain Access > Certificate Assistant > Request a Certificate From a Certificate Authority__
    * Enter Name and Email. You can use a team email team@risebox.co and named it accordingly (Risebox Dev Team CSR) (CA Email is not mandatory)
    * Select __Saved to disk__ and press __continue__. Extension should be .certSigningRequest

1. Create an App ID
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * From Left Menu, in __Identifiers__ section select __App IDs__
  * Click __+__ to add an App ID
    * Set name to __Risebox__
    * Select __Explicit App ID__
    * Set __Bundle ID__ to __co.risebox.app__ (this must match the bundle identifier given at cordova app creation time, for iOS notification to work and can be found in config.xml).
    * Enable __Push Notification__ service
    * Push Notifications should show up as __Configurable__.

2. Create an APNS Enabled Certificate
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * Go to __Certificates, Identifiers & Profiles__ and click __Certificates__
  * Click __+__ to add a Certificate
    * Choose __Apple Push Notification Service SSL (Sandbox)__
    * Select the previously created __Risebox__ AppID
    * For the CSR either use previously created CSR for the team located in the vault or generate a new one following the given howto.
    * Upload the .certSigningRequest file
    * Download the generated __Apple Development iOS Push Services: co.risebox.app__ .cer certificate and store it in the vault.
  * Now is the time to extract the private key of this certificate
    * Double click on the __Apple Development iOS Push Services: co.risebox.app__ file
    * In Keychain Access, under My Certificates, find the certificate you just added. It should be called Apple Development IOS Push Services.
    * Right Click on it, select Export Apple Development IOS..., and save it as a .p12 file. You will be prompted to enter a password which will be used to protect the exported certificate, do not enter one.

3. Create an iOS App Development Certificate
  * Follow the above steps for an APNS Enabled Certificate except you choose __iOS App Development__ instead of __Apple Push Notification Service SSL (Sandbox)__ to generate the __iOS Development: Nicolas NARDONE__ .cer file

5. Register Dev Devices
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * Go to __Certificates, Identifiers & Profiles__ and click __Devices__
  * Click __+__ to add a Certificate
    * Give device a name ex (iPad NNA)
    * Fill in UDID (follow instructions from [WhatsMyUdid](http://whatsmyudid.com/))

6. Hooking up ionic.io
  * Follow instructions from [Ionic Docs](http://docs.ionic.io/docs/push-ios-setup#section-step-4-hooking-up-ionic-io)

7. Setup provisionning profile on Xcode
  * Open Xcode and go to project properties
  * In General > Identity section :
   * Ensure that Bundle identifier is __co.risebox.co__
   * Team: Select __Nicolas Nardone (team@risebox.co)__ (Add the account if it doesn't exist)

Some useful links :
  - [APNS Tutorial](http://ameyashetti.wordpress.com/2009/07/31/apple-push-notification-service-tutorial/)
  - [Getting everything for building iOS apps](https://coderwall.com/p/eceasa)
  - [Push Notification Service iOS6](http://www.raywenderlich.com/32960/apple-push-notification-services-in-ios-6-tutorial-part-1)

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

Also don't forget to setup (or change) the push webhook url so that ionic psu service can call the server with the token
ionic push webhook_url https://rbdev-api.herokuapp.com/api/push_update