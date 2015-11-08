angular.module('risebox.controllers')

.controller('RegisterDeviceCtrl', function($scope, $state, $ionicPopup, RiseboxApi, RiseboxObj, Ionic) {

  $scope.registerDevice = function(user) {
    RiseboxApi.registerDevice(user.email, user.secret, {"origin": ionic.Platform.device()})
                .then(function(response) {

                  RiseboxObj.storeToken(response.result.token);
                  RiseboxApi.login(RiseboxObj.getToken(), {"origin": 'some'})
                  .then(function(response) {

                    RiseboxObj.setInfo(response.result);
                    Ionic.pushRegister();
                    $state.go('tabs.box');

                  }, function(err) {
                    console.log('Login error');
                    $ionicPopup.alert({
                      title: 'Oups ...',
                      template: "Erreur lors de l'enregistrement... Essaye à nouveau !"
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