angular.module('risebox.services')

.factory('RiseboxApi', function($http, $q, EnvConfig) {

  var callApi = function(verb, url, headers, params) {
    var q = $q.defer();

    $http({
      method:  verb,
      url:     EnvConfig.RISEBOX_API_ENDPOINT.url + url,
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

  var defaultHeader = function(secret){
    return {"RISEBOX-SECRET": secret, "RISEBOX-API-CLIENT": 'app'}
  }

  var getDeviceSettings = function(box_key, box_secret, selected_settings) {
    return callApi( 'get',
                    '/api/devices/'+ box_key +'/settings?mode=select&select=' + selected_settings,
                    defaultHeader(box_secret),
                    null )
  }

  var setDeviceSettings = function(box_key, box_secret, settings) {
   return callApi( 'post',
                   '/api/devices/'+ box_key +'/settings/bulk_update',
                   defaultHeader(box_secret),
                   {'settings': settings} )
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
   return callApi('post', '/api/devices/'+ box_key +'/strips', defaultHeader(box_secret), params)
  }

  var getStripResults = function(box_key, box_secret, strip_id, params) {
   return callApi('get', '/api/devices/'+ box_key +'/strips/' + strip_id, defaultHeader(box_secret), params)
  }

  var getLightSettings = function(box_key, box_secret) {
   return getDeviceSettings(box_key, box_secret, 'upper_blue,upper_red,upper_white,lower_blue,lower_red,lower_white,day_hours,day_minutes,night_hours,night_minutes');
  }

  var setLightSettings = function(box_key, box_secret, settings) {
   return setDeviceSettings(box_key, box_secret, settings);
  }

  var setLightSchedules = function(box_key, box_secret, settings) {
   return setDeviceSettings(box_key, box_secret, settings);
  }

  var getPauseSettings = function(box_key, box_secret) {
   return getDeviceSettings(box_key, box_secret, 'no_lights_until,silent_until');
  }

  var setPauseSettings = function(box_key, box_secret, settings) {
   return setDeviceSettings(box_key, box_secret, settings);
  }

  return {
    registerDevice: registerDevice,
    login: login,
    getUploadSignature: getUploadSignature,
    analyzeStrip: analyzeStrip,
    getStripResults: getStripResults,
    getLightSettings: getLightSettings,
    setLightSettings: setLightSettings,
    getPauseSettings: getPauseSettings,
    setPauseSettings: setPauseSettings,
    setLightSchedules: setLightSchedules
  };

});