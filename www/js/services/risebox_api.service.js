angular.module('risebox.services')

.factory('RiseboxApi', function($http, $q, RiseboxApiEndpoint) {

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

  var tokenHeader = function(token){
    return {"RISEBOX-REGISTRATION-TOKEN": token}
  }

  var secretHeader = function(secret){
    return {"RISEBOX-SECRET": secret}
  }

  //Exposed APIs
  var registerDevice = function(params) {
   return callApi('post', '/api/registration', null, params)
  }

  var login = function(params) {
    return callApi('post', '/api/login', tokenHeader(params.token), params)
  }

  var getUploadSignature = function(params) {
    return callApi('post', '/sign', null, params)
  }

  var analyzeStrip = function(box_key, box_secret, params) {
   return callApi('post', '/api/devices/'+ box_key +'/strips', secretHeader(box_secret), params)
  }

  return {
    registerDevice: registerDevice,
    login: login,
    getUploadSignature: getUploadSignature,
    analyzeStrip: analyzeStrip,
  };

});