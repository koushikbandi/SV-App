# README #

### Global Requirements
* the latest version of Node that has been verified to work with this repo is 6.10.0. Newer versions may work fine, but there may be issues with node-sass.

* `npm install -g ionic@2.2.1`

    Ionic is the hybrid mobile app framework used to write this app. It is basically a library of angular directives and css classes. We are currently using version 1.2.

    The Ionic CLI is a wrapper around the Cordova CLI.

    [Ionic docs](ionicframework.com/docs/)

* `npm install -g cordova`

    cordova is the tool that compiles your javascript into android and ios apps. There are a couple things you might want to do with the cordova CLI that you can't do with the Ionic CLI

* `npm install -g jspm`

    jspm is the client-side package manager used by this project. It's like webpack or bower.

* `npm install -g gulp`

    gulp is the build tool that the Ionic CLI uses to do livereload and sass compilation

* `npm install -g ios-deploy`

    this is needed to build to iOS devices

### Setting up the app
1. clone the repo and cd into the directory

2. `npm install` - this will install all the node dependencies. A postinstall script will automatically run `jspm install` to install the clientside javascript dependencies as well as `gulp sass` to configure the css and `ionic state reset` to install the cordova plugins

### Running the app in development

* `gulp devMode` will point the app at the development instance of firebase (https://smartvandev.firebaseio.com)

* `gulp stagingMode` will point the app at the staging instance of firebase (rexelvantesting.firebaseio.com)

* `gulp prodMode` will point the app at the production instance of firebase (smartvan.firebase.io.com)

* `gulp bundle` will build the bundle file and load it in a script tag in `www/index.html`

* `gulp unbundle` will remove the bundle file and comment out the script tag in `www/index.html`

* `ionic serve` - this will run the app in your browser, with livereload

* `ionic run [android/ios] --device` - this will install and run the app on a phone that is plugged into your machine

### Building for production (iOS and Android)

* Increment the 'android-versionCode', 'ios-CFBundleVersion', and 'version' attributes at the top of config.xml

* Put the app in "production mode":
    * run `gulp prodMode` (makes sure the production Firebase is referenced in `www/js/services/init.js`)
    * run `gulp bundle` (makes sure the script tag requiring `build.js` is uncommented in www/index.html, builds the bundle file)

#### Android

1. `./buildAndroid.sh`

    this shell script will:

    * build a release .apk
    * sigin the apk with the keystore key
    * 'zipalign' the apk (whatever that means)

#### iOS

1. `ionic prepare ios` - this does some cordova magic that needs to happen

2. `ionic build --release ios` - this will build the smartvan xcode project

3. Double click `SmartVan.xcodeproj` in `platforms/ios` to open the project in xcode

4. Assuming all your developer/distribution certificates/provisioning profiles are set up correctly (for the time being, beyond the scope of this README...) you should be able to `Product -> Archive` without errors

5. From the archive window that pops up, you can `Upload to App Store` or `Export`. If you export, you can save for ad-hoc distribution. The resulting .ipa file can be installed on any phone whose UDID was included in the provisioning profile used to build the app.

### Architecture Overview
