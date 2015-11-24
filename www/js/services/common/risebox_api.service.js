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

  var registrationHeader = function(user_email, user_secret){
    return {"RISEBOX-USER-EMAIL": user_email, "RISEBOX-USER-SECRET": user_secret}
  }

  var defaultHeader = function(registration_token){
    return {"RISEBOX-APP-REGISTRATION-TOKEN": registration_token, "RISEBOX-API-CLIENT": 'app'}
  }

  var getDeviceSettings = function(registration_token, box_key, selected_settings) {
    return callApi( 'get',
                    '/api/devices/'+ box_key +'/settings?mode=select&select=' + selected_settings,
                    defaultHeader(registration_token),
                    null )
  }

  var setDeviceSettings = function(registration_token, box_key, settings) {
   return callApi( 'post',
                   '/api/devices/'+ box_key +'/settings/bulk_update',
                   defaultHeader(registration_token),
                   {'settings': settings} )
  }

  var getMetrics = function(registration_token, box_key, metrics) {
   result =  callApi( 'get',
                      '/api/devices/'+ box_key +'/metrics',
                      defaultHeader(registration_token))
   return result;
   //TODO: filter metrics (only the one asked and clean results)
  }

  var getMeasures = function(registration_token, box_key, metric_key, params) {
   result =  callApi( 'get',
                      '/api/devices/' + box_key + '/metrics/' + metric_key + '/measures?begin_at=' + params['since'],
                      defaultHeader(registration_token))
   return result;
  }

  //Exposed APIs
  var registerDevice = function(user_email, user_secret, params) {
   return callApi('post', '/api/app/registration', registrationHeader(user_email, user_secret), params)
  }

  var login = function(registration_token, params) {
    return callApi('post', '/api/app/login', defaultHeader(registration_token), params)
  }

  //Strips
  var getUploadSignature = function(params) {
    return callApi('post', '/sign', null, params)
  }

  var analyzeStrip = function(registration_token, box_key, params) {
   return callApi('post', '/api/devices/'+ box_key +'/strips', defaultHeader(registration_token), params)
  }

  var getStripResults = function(registration_token, box_key, strip_id, params) {
   return callApi('get', '/api/devices/'+ box_key +'/strips/' + strip_id, defaultHeader(registration_token), params)
  }

  //Settings

  var getLightSettings = function(registration_token, box_key) {
   return getDeviceSettings(registration_token, box_key, 'upper_blue,upper_red,upper_white,lower_blue,lower_red,lower_white,day_hours,day_minutes,night_hours,night_minutes');
  }

  var setLightSettings = function(registration_token, box_key, settings) {
   return setDeviceSettings(registration_token, box_key, settings);
  }

  var setLightSchedules = function(registration_token, box_key, settings) {
   return setDeviceSettings(registration_token, box_key, settings);
  }

  var getPauseSettings = function(registration_token, box_key) {
   return getDeviceSettings(registration_token, box_key, 'no_lights_until,silent_until');
  }

  var setPauseSettings = function(registration_token, box_key, settings) {
   return setDeviceSettings(registration_token, box_key, settings);
  }

  //Metrics

  var getGrowbedMetrics = function(registration_token, box_key) {
   return getMetrics(registration_token, box_key, 'ATEMP,AHUM,UCYC,LCYC');
  }

  var getTankMetrics = function(registration_token, box_key) {
   return getMetrics(registration_token, box_key, 'WTEMP,PH,NH4,NO2,NO3,GH,KH');
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
    setLightSchedules: setLightSchedules,
    getGrowbedMetrics: getGrowbedMetrics,
    getTankMetrics: getTankMetrics,
    getMeasures: getMeasures
  };

});