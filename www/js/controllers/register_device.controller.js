angular.module('risebox.controllers')

.controller('RegisterDeviceCtrl', function($scope, $state, $ionicPopup, RiseboxApi, RiseboxObj) {

  $scope.registerDevice = function(box) {
    RiseboxApi.registerDevice({"key": box.key, "token": box.token, "origin": ionic.Platform.device()})
                .then(function(response) {
                  RiseboxObj.storeToken(response.result.token);
                  RiseboxApi.login({token: RiseboxObj.getToken()})
                  .then(function(response) {
                    RiseboxObj.setInfo(response.result);
                    $state.go('tabs.box');
                  }, function(err) {
                    console.log('Login error');
                    $ionicPopup.alert({
                      title: 'Oups ...',
                      template: "Erreur lors du login... Essaye à nouveau !"
                    });
                  });


                }, function(err) {
                  console.log('Register device error');
                  $ionicPopup.alert({
                    title: 'Oups ...',
                    template: "ID et token ne sont pas bons... Essaye encore !"
                  });
                })
  };

})