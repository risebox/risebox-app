angular.module('risebox.services')

.factory('RiseboxObj', function($localstorage) {

  var _token = $localstorage.get('risebox-registration-token', null)
  var _info  = {}

  var getInfo = function(){
    return _info
  }

  var setInfo = function(info){
    _info = info.result
  }

  var getToken = function() {
    return _token
  }

  var storeToken = function(token) {
    $localstorage.set('risebox-registration-token', token)
    _token = token
  }

  return {
    getInfo: getInfo,
    setInfo: setInfo,
    getToken: getToken,
    storeToken: storeToken
  };

});