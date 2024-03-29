# risebox-app: Your Risebox mobile assistant

### Contents
- [Pre-requisites](#pre)
- [Installation](#install)
- [Android Provision](#android_provision)
- [iOS Provision](#ios_provision)
- [Push Notifications](#push)
- [Store publication](#publish)

##<a name="pre"></a> Pre-requisites

0. Android:

Install Java SDK:
  - On MAC OSX El Capitan, type ```java -version``` on terminal and follow instructions or [go here](the Java downloads page directly here on Oracle.com)

Then, follow instructions from [here]( http://cordova.apache.org/docs/en/3.4.0/guide/platforms/android/index.html#Android%20Platform%20Guide) to install Android SDK

  - Install the Android SDK from developer.android.com/sdk.

  The android sdk is distributed as an 'adt-bundle---' file. On windows, the adt-bundle is packaged with an installer. On OSX and Linux, simply unpack the 'adt-bundle' in the location you store development tools. More detailed information on Android SDK setup can be found [here](http://developer.android.com/sdk/installing/bundle.html)

  - Run ```./tools/android``` and check __Android SDK Tools__, __Android SDK Platform-tools__ and __Android SDK Build-tools__ as well as the __Android Support Library__ and __Android Support Repository__ and __The latest android SDK (API 23 at this time)__ required by cordova in order to run.
  
  - For Cordova command-line tools to work, you need to include the SDK's tools and platform-tools directories in your PATH environment. On Mac, you can use a text editor to create or modify the __~/.bash_profile__ file, adding a line such as the following, depending on where the SDK installs:
```
export PATH=${PATH}:/Development/adt-bundle/sdk/platform-tools:/Development/adt-bundle/sdk/tools
```

This exposes SDK tools in newly opened terminal windows. Otherwise run this to make them available in the current session:
```
source ~/.bash_profile
```

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
  sudo npm install -g gulp
  conf
  # or
  ./tools/config.sh # uses env matching current branch
  ```

4. Build and run risebox-app
  ```
  bu
  # or
  ./tools/build.sh
  ```
  This will create the __www/js/config/env-config.js__ with angular constants used by the app

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
  sudo npm install -g ios-sim
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
    * Double click on the __Apple Development iOS Push Services: co.risebox.app__.cer file
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
ionic push webhook_url https://rbdev-api.herokuapp.com/api/app/push_update

##<a name="publish"></a> Publish on stores

### Apple Store

Once app is builded with ```ionic build``` you need to generate a .ipa file to upload to the store.

1. Create Adhoc and Production provisionning profiles

0. Create Distribution certificate request CSR (if necessary)
  * You need to generate a certificate signing request file (CSR). This is used to authenticate the creation of an SSL certificate.
  * Launch __Keychain Access__ on your Mac
    * Navigate to __Keychain Access > Certificate Assistant > Request a Certificate From a Certificate Authority__
    * Enter Name and Email. You can use a team email team@risebox.co and named it accordingly (Risebox Dev Team CSR) (CA Email is not mandatory)
    * Select __Saved to disk__ and press __continue__. Extension should be .certSigningRequest

1. Create a Distribution Certificate
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * Go to __Certificates, Identifiers & Profiles__ and click __Certificates__
  * Click __+__ to add a Certificate
    * Choose __App Store and Ad Hoc__
    * For the CSR either use previously created Distribution CSR for the team located in the vault or generate a new one following the given howto.
    * Upload the .certSigningRequest file
    * Download the generated __iOS Distribution: RISEBOX__ .cer certificate and store it in the vault.
  * Now is the time to extract the private key of this certificate
    * Double click on the __iOS Distribution: RISEBOX__.cer file
    * In Keychain Access, under My Certificates, find the certificate you just added. It should be called __iPhone Distribution RISEBOX__.
    * Right Click on it, select Export Apple Distribution IOS..., and save it as a .p12 file. You will be prompted to enter a password which will be used to protect the exported certificate, do not enter one.

2. Create Distribution (Adhoc and App store) Provisionning profile
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * Go to __Certificates, Identifiers & Profiles__ and click __Provisioning Profile__
  * Choose __Adhoc__
  * Select your App ID
  * Select RISEBOX  iOS Distribution certificates you just create earlier
  * Name it __risebox_app_adhoc_profile__ and click __Generate__
  * Download it

  * Repeat theses steps for __App Store__ provisionning profile

3. Configure Xcode
  * Start XCode
  * In project inspector window, in the __General__ tab and __Identity__ section, select RISEBOX Team
  * in the __Build Settings__ tab and __Code signing__ section, choose identity __iPhone Distribution (RISEBOX)__

4. Build the project
```
ionic build ios --release
```

5. Create an archive

You need to have Xcode on your local machine
```
cd platforms/ios

/usr/bin/xcodebuild archive           \
    -project RiseboxApp.xcodeproj  \
    -scheme RiseboxApp              \
    -archivePath RiseboxApp
```

6. Generate .ipa
You now have a .xcarchive generated. Run the following command to generate the .ipa

```
xcodebuild -exportArchive -archivePath <arch_path> -exportPath <export_path> -exportOptionsPlist <plist> PROVISIONING_PROFILE=<provisionning_profile_key>
```
where:
 - __arc_path__ is the path to archive (ex: ~/dev/risebox-app/platforms/ios/RiseboxApp.xcarchive)
 - __export_path__ is the folder where you want the ipa to be generated (ex: /tmp)
 - __plist__ is path to .plist file (ex: /tmp/info.plist)
 - __provisionning_profile_key__ is the key of the provisionning profile used to generate the archive. You should find it in the files at ```ls ~/Library/MobileDevice/Provisioning\ Profiles/*```

the .plist file should be contain __method__ and __teamID__ like this:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>app-store</string>
	<key>teamID</key>
	<string>YOUR 10 CHARACTER TEAM ID</string> 
</dict>
</plist>
```

for more info on ipa generation check [here](http://encyclopediaofdaniel.com/blog/xcarchive-to-ipa/) and [here](https://wasin.io/2015/07/archive-and-export-xcode-project-with-command-line/) 

7. Upload .ipa using Application Loader


### Android Store
Follow [Ionic Doc](http://ionicframework.com/docs/guide/publishing.html):

1. Build the app with release flag
```
ionic build --release android
```

2. Generate or retrieve signing private key
```
keytool -genkey -v -keystore risebox-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```
You have to give a password.
Once generated the file will be in the vault.

3. Sign jar file and zip it
```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore risebox-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name

/Applications/adt-bundle-mac-x86_64-20140702/sdk/build-tools/22.0.1/zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk RiseboxApp.apk
```

4. Upload APK
Go to your [Play store](https://play.google.com/apps/publish) and upload signed apk.
