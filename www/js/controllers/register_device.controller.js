angular.module('risebox.controllers')

.controller('RegisterDeviceCtrl', function($scope, $state, $ionicPopup, RiseboxApi) {

  $scope.registerDevice = function(box) {
    RiseboxApi.registerDevice({"key": box.key, "token": box.token, "origin": ionic.Platform.device()})
                  .then(function() {
                    //TODO: here store token locally
                    $state.go('tabs.box');
                  }, function(err) {
                    console.log('Register device error');
                    $ionicPopup.alert({
                      title: 'Oups ...',
                      template: "ID et token ne sont pas bons... Essaye encore !"
                    });
                  })
  };

})