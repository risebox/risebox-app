angular.module('risebox.config')

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="spiral" class="spinner-balanced"></ion-spinner>&nbsp;Traitement en cours ...',
  hideOnStateChange: true,
  duration: 60000
})

;