angular.module('risebox.services')

.factory('RiseboxApi', function($http, $q, RiseboxApiEndpoint, $localstorage) {

  var callApi = function(verb, url, headers, params) {
    var q = $q.defer();

    $http({
      method:  verb,
      url:     RiseboxApiEndpoint.url + url,
      headers: headers,
      data:    params
    })
    .success(function(data) {
      q.resolve(data);
    })
    .error(function(error){
      q.reject(error);
    })

    return q.promise;
  }

  var registrationToken = function(token){
    return {"RISEBOX-REGISTRATION-TOKEN": token}
  }

  var secret = function(){
    return {"RISEBOX-SECRET": 'token2'}
  }

  //Exposed APIs
  var registerDevice = function(params) {
   return callApi('post', '/api/registration', null, params)
  }

  var login = function(params) {
    return callApi('post', '/api/login', registrationToken(params.token), params)
  }

  var getUploadSignature = function(params) {
    return callApi('post', '/sign', null, params)
  }

  var analyzeStrip = function(params) {
   return callApi('post', '/api/devices/lab1/strips', secret(), params)
  }

  return {
    registerDevice: registerDevice,
    login: login,
    getUploadSignature: getUploadSignature,
    analyzeStrip: analyzeStrip,
  };

});