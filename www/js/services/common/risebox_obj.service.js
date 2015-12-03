angular.module('risebox.services')

.factory('RiseboxObj', function($localstorage) {

  var _token  = $localstorage.get('risebox-registration-token', null)
  var _info  = {}

  var getInfo = function(){
    return _info
  }

  var setInfo = function(info){
    _info = info
  }

  var getToken = function() {
    return _token
  }

  var storeToken = function(token) {
    $localstorage.set('risebox-registration-token', token)
    _token = token
  }

  var setIonicUserId = function(userId) {
    _info['user']['ionic_id'] = userId;
  }

  var setPush = function(push_data) {
    _info['push'] = push_data;
  }

  var getRiseboxUserId = function() {
    return _info['user']['id'];
  }

  var isAdminUser = function() {
    return _info['user']['admin'];
  }

  return {
    getInfo: getInfo,
    setInfo: setInfo,
    getToken: getToken,
    storeToken: storeToken,
    setIonicUserId: setIonicUserId,
    setPush: setPush,
    getRiseboxUserId: getRiseboxUserId,
    isAdminUser: isAdminUser
  };

});