# Shodan.io-mobile-app
Official repository for the Shodan.io mobile Application

The Android version can actually be found [here](https://play.google.com/store/apps/details?id=io.shodan.app). 
The iOS version is not available anymore since Apple subscription was really expensive for such few users. 
However, the source code is now available so you can easily build the application and make it run on your iPhone/iPad. 

# How? 

This app has been built using the [ionic framework](http://ionicframework.com/) which is basically using [PhoneGap](http://phonegap.com/) and [Cordova](https://cordova.apache.org/) but also includes [AngularJS](https://angularjs.org/) to build hybrid application (HTML5 + JavaScript basically).

# Contribution

Good news! The source code is now avaible.

* **Ionic-cli is required** before you start doing anything. 
* Go inside the ```code``` repository 
* ```ionic serve``` and this should install everything for you, run it locally and open up your fav browser with the app loaded in!

Want to build for your platform? No worries, Ionic got you cover: 

1. Add the platform that you want to

```bash
ionic add platform ios|android|...
```

2. Build the platform you want to application to run

```bash
ionic build platform ios|android|...
```

The Ionic documentation is worth it here: [https://ionicframework.com/docs/cli/cordova/build/](https://ionicframework.com/docs/cli/cordova/build/) 

# Updating ionic version? 

For this, I was using:

```bash
rm www/lib/ionic/bower.json
ionic lib update
```

# Updating other libs using bower?

For this, use the command:

```bash
bower update
```

# Contact me? 

If you want to contact me, use my twitter handle: [@PaulWebSec](https://twitter.com/PaulWebSec) 