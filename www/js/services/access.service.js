angular.module('risebox.services')

.factory('Access', function($q, $state, $ionicPopup, RiseboxObj, RiseboxApi) {

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
      var q = $q.defer();
      RiseboxApi.login({token: RiseboxObj.getToken()})
      .then(function(response) {
        RiseboxObj.setInfo(response);
        $state.go('tabs.box');
        q.resolve();
      }, function(err) {
        $ionicPopup.alert({
          title: 'Oups ...',
          template: "Erreur lors du login... Essaye à nouveau !"
        });
        q.reject(err);
      });
      return q.promise;
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