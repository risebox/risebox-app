angular.module('risebox.services')

.factory('Access', function($state, $ionicPopup, RiseboxObj, RiseboxApi) {

  var token_exists = function() {
    if (RiseboxObj.getToken() != null) {
      return true;
    }
    else {
      return false;
    }
  }

  var redirect_to_registration = function() {
    $state.go('welcome');
  }

  var login = function (){
    if (token_exists() == true){
      console.log('in login RiseboxObj.getToken()');
      console.log(RiseboxObj.getToken());
      RiseboxApi.login({token: RiseboxObj.getToken()})
      .then(function(response) {
         RiseboxObj.setInfo(response);
        $state.go('tabs.box');
      }, function(err) {
        $ionicPopup.alert({
          title: 'Oups ...',
          template: "Erreur lors du login... Essaye à nouveau !"
        });
      });
    }
    else {
      redirect_to_registration()
    }
  }

  return {
    token_exists: token_exists,
    redirect_to_registration: redirect_to_registration,
    login:login
  }
})

;