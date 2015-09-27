angular.module('risebox.services')

.factory('PauseManager', function($q, RiseboxObj, RiseboxApi) {

  var _pauseConfig = {
    lights: { settingName: 'no_lights_until', duration: 10},
    full:   { settingName: 'silent_until', duration: 30}
  }

  var _pauseSettings = {};

  var addMinutes = function (minutes) {
    var now = new Date().getTime();
    return new Date(now + minutes*60000).getTime();
  }

  var cleanSettings = function(raw_settings) {
    var cleanSettings = {};
    raw_settings.forEach(function(setting) {
      cleanSettings[setting.key] = setting.value;
    });
    return cleanSettings;
  }

  var getConfig = function () {
    var q = $q.defer();

    RiseboxApi.getPauseSettings( RiseboxObj.getInfo().device.key,
                                 RiseboxObj.getInfo().device.token)
              .then(function(result) {
                _pauseSettings = computePauseSettings(cleanSettings(result.result));
                q.resolve(_pauseSettings);
              }, function(err) {
                console.log("Désolé impossible de récupérer les infos de pause");
                q.reject(err);
              });

    return q.promise;
  }

  var setConfig = function (settings) {
    var q = $q.defer();

    RiseboxApi.setPauseSettings( RiseboxObj.getInfo().device.key,
                                 RiseboxObj.getInfo().device.token,
                                 settings)
              .then(function() {
                q.resolve();
              }, function(err) {
                console.log("Désolé impossible de mettre à jour la config de pause");
                q.reject(err);
              });

    return q.promise;
  }

  var temporaryOff= function(settingKey){
    var h = {};
    h[_pauseConfig[settingKey].settingName] = parseInt(addMinutes(_pauseConfig[settingKey].duration)/1000); //because server epoch is in seconds not ms
    return setConfig(h);
  }

  var on = function(settingKey){
    var h = {};
    h[_pauseConfig[settingKey].settingName] = null;
    return setConfig(h);
  }

  var temporaryLightsOff = function(){
    return temporaryOff('lights');
  }

  var temporaryShutdown = function(){
    return temporaryOff('full');
  }

  var lightsOn = function(){
    return on('lights');
  }

  var fullOn = function(){
    return on('full');
  }

  var computePauseSettings = function(rawSettings) {
    var pauseSettings = {};
    for (var configKey in _pauseConfig) {
      if (_pauseConfig.hasOwnProperty(configKey)) {
        var endAt = rawSettings[_pauseConfig[configKey].settingName];
        var status = computeStatus(endAt);
        pauseSettings[configKey] = {status: status, duration: _pauseConfig[configKey].duration, end: endAt};
      }
    }
    return pauseSettings;
  }

  var computeStatus = function(pauseEndDateTime) {
    if (pauseEndDateTime == null) {
      return false;
    }
    var endDate = Date.parse(pauseEndDateTime);
    var now = new Date().getTime();
    if (endDate == null || endDate == undefined) {
      return false;
    } else {
      if (endDate <= now){
        return false;
      } else {
        return true;
      }
    }
  };

  return {
    getConfig: getConfig,
    temporaryLightsOff: temporaryLightsOff,
    lightsOn: lightsOn,
    temporaryShutdown: temporaryShutdown,
    fullOn: fullOn
  }
})

;