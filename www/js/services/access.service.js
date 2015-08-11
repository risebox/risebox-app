angular.module('risebox.services')

.factory('Access', function($localstorage, $state, $ionicPopup, RiseboxApi) {

  var token_exists = function() {
    if ($localstorage.get('risebox-registration-token') != null) {
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
      RiseboxApi.login({token: $localstorage.get('risebox-registration-token')})
      .then(function(response) {
        $localstorage.setObject('risebox-registration-info', response)
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