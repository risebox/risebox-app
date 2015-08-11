angular.module('risebox.services')

.factory('RiseboxApi', function($http, $q, RiseboxApiEndpoint) {

  var getUploadSignature = function(params) {
    var q = $q.defer();

    $http.post(RiseboxApiEndpoint.url + '/sign', params)
    .success(function(data) {
      q.resolve(data);
    })
    .error(function(error){
      q.reject(error);
    })

    return q.promise;
  }

  var analyzeStrip = function(params) {
    var q = $q.defer();

    $http({
        method: "post",
        url: RiseboxApiEndpoint.url + '/api/devices/lab1/strips',
        headers: {
          "RISEBOX-SECRET": 'token2'
        },
        data: params
    })
    .success(function(data) {
      q.resolve(data);
    })
    .error(function(error){
      q.reject(error);
    })

    return q.promise;
  }

  var registerDevice = function(params) {
    var q = $q.defer();

    $http({
        method: "post",
        url: RiseboxApiEndpoint.url + '/api/registration',
        data: params
    })
    .success(function(data) {
      q.resolve(data);
    })
    .error(function(error){
      q.reject(error);
    })

    return q.promise;
  }

  var login = function(params) {
    var q = $q.defer();

    $http({
        method: "post",
        url: RiseboxApiEndpoint.url + '/api/login',
        headers: {
          "RISEBOX-REGISTRATION-TOKEN": params.token
        },
        data: params
    })
    .success(function(data) {
      q.resolve(data);
    })
    .error(function(error){
      q.reject(error);
    })

    return q.promise;
  }

  return {
    getUploadSignature: getUploadSignature,
    analyzeStrip: analyzeStrip,
    registerDevice: registerDevice,
    login: login
  };

});