angular.module('risebox.routing', ['ionic', 'risebox.services'])

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
    templateUrl: "templates/tabs.html",
    data: { auth: "TokenRequired"}
    // resolve: {
    //   AccessControl: 'AccessControl',
    //   accessGranted: function(AccessControl){
    //     return AccessControl.perform();
    //   }
    // }
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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tabs/box');
})

;