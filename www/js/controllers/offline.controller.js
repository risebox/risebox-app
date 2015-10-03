angular.module('risebox.controllers')

.controller('OfflineCtrl', function($state, $scope, App) {

    $scope.initApp = function(){
      App.init(function(){
        $state.go('tabs.box');
      },function(){
        $state.go('offline');
      });
    }

});