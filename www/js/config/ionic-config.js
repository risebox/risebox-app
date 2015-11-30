angular.module('risebox.config')

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  $ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})

.config(['$ionicAppProvider', function($ionicAppProvider) {
  var settings = new Ionic.IO.Settings();
  $ionicAppProvider.identify({
    app_id: settings.get('app_id'),
    api_key: settings.get('api_key'),
    dev_push: settings.get('dev_push')
  });
}])

;