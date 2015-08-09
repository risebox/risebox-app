angular.module('risebox.config', ['ionic'])

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

;