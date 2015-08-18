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
    var q = $q.defer();
    if (token_exists() == true){
      RiseboxApi.login({token: RiseboxObj.getToken()})
      .then(function(response) {
        RiseboxObj.setInfo(response.result);
        $state.go('tabs.box');
        q.resolve();
      }, function(err) {
        $ionicPopup.alert({
          title: 'Oups ...',
          template: "Erreur lors du login... Essaye à nouveau !"
        });
        q.reject(err);
      });
    }
    else {
      redirect_to_registration()
      q.reject();
    }
    return q.promise;
  }

  return {
    token_exists: token_exists,
    redirect_to_registration: redirect_to_registration,
    login:login
  }
})

;