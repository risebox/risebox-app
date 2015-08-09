angular.module('risebox.services')

.factory('RiseboxApi', function($http, $q, RiseboxApiEndpoint) {

  var config = {
    headers: {
      "RISEBOX-SECRET": '4dee01d78a2800a378c8d63afc41fc9b'
    }
  };

  var getApiData = function() {
    var q = $q.defer();

    $http.get(RiseboxApiEndpoint.url)
    .success(function(data) {
      console.log('Got some data: ', data)
      q.resolve(data);
    })
    .error(function(error){
      console.log('Had an error')
      q.reject(error);
    })

    return q.promise;
  }

  var getSignature = function(params) {
    var q = $q.defer();

    $http.post(RiseboxApiEndpoint.url + '/sign', params)
    .success(function(data) {
      console.log('Posted some data: ', data)
      q.resolve(data);
    })
    .error(function(error){
      console.log('Had an error on POST')
      q.reject(error);
    })

    return q.promise;
  }

  var analyzeStrip = function(params) {
    var q = $q.defer();

    console.log('params');
    console.log(params);

    $http({
        method: "post",
        url: RiseboxApiEndpoint.url + '/api/devices/lab1/strips',
        headers: {
          "RISEBOX-SECRET": 'token2'
        },
        data: params
    })
    .success(function(data) {
      console.log('Posted some data: ', data)
      q.resolve(data);
    })
    .error(function(error){
      console.log('Had an error on POST')
      q.reject(error);
    })

    return q.promise;
  }

  return {
    getApiData:  getApiData,
    getSignature: getSignature,
    analyzeStrip: analyzeStrip
  };

});