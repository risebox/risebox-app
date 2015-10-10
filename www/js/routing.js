angular.module('risebox.routing', ['ionic', 'risebox.services'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html'
  })

  .state('offline', {
    url: '/offline',
    templateUrl: 'templates/offline.html',
    controller: 'OfflineCtrl'
  })

  .state('register-device', {
    url: '/register-device',
    templateUrl: 'templates/register-device.html',
    controller: 'RegisterDeviceCtrl'
  })

  .state('about', {
    url: '/about',
    templateUrl: 'templates/about.html',
    controller: 'AboutCtrl'
  })

  .state('tabs', {
    url: "/tabs",
    abstract: true,
    templateUrl: "templates/tabs.html",
    data: { auth: "TokenRequired"}
  })

  .state('tabs.box', {
    url: '/box',
    views: {
      'box-tab': {
        templateUrl: 'templates/box/show.html',
        controller: 'BoxCtrl'
      }
    }
  })

  .state('tabs.chemistry-status', {
    url: '/chemistry/status',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/status.html'
      }
    }
  })

  .state('tabs.chemistry-instructions', {
    url: '/chemistry/instructions',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/instructions.html',
        controller: 'ChemistryNewCtrl'
      }
    }
  })

  .state('tabs.chemistry-new-test', {
    url: '/chemistry/new-test',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/new-test.html',
        controller: 'ChemistryNewCtrl'
      }
    }
  })

  .state('tabs.chemistry-result', {
    url: '/chemistry/result/:strip_id',
    views: {
      'box-tab': {
        templateUrl: 'templates/chemistry/result.html',
        controller: 'ChemistryShowCtrl'
      }
    }
  })

  .state('tabs.pause-status', {
    url: '/pause/status',
    views: {
      'box-tab': {
        templateUrl: 'templates/pause/status.html',
        controller: 'PauseStatusCtrl'
      }
    }
  })

  .state('tabs.growbed-status', {
    url: '/growbed/status',
    views: {
      'box-tab': {
        templateUrl: 'templates/growbed/status.html',
        controller: 'GrowbedStatusCtrl'
      }
    }
  })

  .state('tabs.light-status', {
    url: '/light/status',
    views: {
      'box-tab': {
        templateUrl: 'templates/light/status.html',
        controller: 'LightStatusCtrl'
      }
    }
  })

  .state('tabs.tank-status', {
    url: '/tank/status',
    views: {
      'box-tab': {
        templateUrl: 'templates/tank/status.html',
        controller: 'TankStatusCtrl'
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