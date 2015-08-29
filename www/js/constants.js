angular.module('risebox.constants', ['ionic'])

.constant('RiseboxApiEndpoint', {
  url: 'https://rbnna-api.herokuapp.com'
})

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>&nbsp;Traitement en cours ...',
  hideOnStateChange: true,
  duration: 60000
})

;