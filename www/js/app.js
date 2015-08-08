// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('risebox', ['ionic', 'ngCordova', 'risebox.controllers', 'risebox.services'])

.constant('ApiEndpoint', {
  url: 'https://rbnna-api.herokuapp.com'
})

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>&nbsp;Traitement en cours ...',
  hideOnStateChange: true,
  duration: 10000
})

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.run(function($ionicPlatform) {
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
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  $ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html'
  })

  .state('register-device', {
    url: '/register-device',
    templateUrl: 'templates/register-device.html',
    controller: 'RegisterDeviceCtrl'
  })

  .state('tabs', {
    url: "/tabs",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tabs.box', {
    url: '/box',
    views: {
      'box-tab': {
        templateUrl: 'templates/box/show.html'
      }
    }
  })

  .state('tabs.chemistry-status', {
    url: '/chemistry/status',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/status.html',
        controller: 'ChemistryCtrl'
      }
    }
  })

  .state('tabs.chemistry-instructions', {
    url: '/chemistry/instructions',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/instructions.html',
        controller: 'ChemistryCtrl'
      }
    }
  })

  .state('tabs.chemistry-new-test', {
    url: '/chemistry/new-test',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/new-test.html',
        controller: 'ChemistryCtrl'
      }
    }
  })

  .state('tabs.help', {
    url: '/help',
    views: {
      'help-tab': {
        templateUrl: 'templates/help.html'
      }
    }
  })

  .state('tabs.shop', {
    url: '/shop',
    views: {
      'shop-tab': {
        templateUrl: 'templates/shop.html'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
