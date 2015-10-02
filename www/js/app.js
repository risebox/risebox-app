angular.module('risebox', ['ionic', 'ionic.service.core', 'ionic.service.deploy', 'ionic.service.push',  'ionic.utils', 'ngCordova', 'risebox.config', 'risebox.services', 'risebox.routing', 'risebox.controllers'])

.run(function($ionicPlatform, $rootScope, Access, Ionic, RiseboxObj) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    //On every secure page check that that token is present
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if ( toState.data && toState.data.auth === 'TokenRequired' ) {
        if (Access.token_exists() == false) {
          event.preventDefault();
          Access.redirect_to_registration();
        }
      }
    });

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
      console.log('Ionic Push: Got token ', data.token, data.platform);
      RiseboxObj.setPush({platform: data.platform, token: data.token});
      Ionic.identifyUser({risebox: {registration_token: RiseboxObj.getToken()}});
    });

  });
})

;
