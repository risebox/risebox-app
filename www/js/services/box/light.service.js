angular.module('risebox.services')

.factory('Light', function($q, RiseboxObj, RiseboxApi) {

  var _settings       = {};
  var _config         = {};

  var growRedRatio    = 40;
  var growBlueRatio   = 60;
  var growWhiteRatio  =  0;

  var bloomRedRatio   = 60;
  var bloomBlueRatio  = 40;
  var bloomWhiteRatio =  0;

  var chillRedRatio   =   0;
  var chillBlueRatio  =   0;
  var chillWhiteRatio = 100;

  var getConfig = function () {
    var q = $q.defer();

    RiseboxApi.getLightSettings( RiseboxObj.getToken(),
                                 RiseboxObj.getInfo().devices[0].key)
              .then(function(result) {
                cleanSettings(result.result);
                computeRecipes();
                computeSchedules();
                q.resolve(_config);
              }, function(err) {
                console.log("Désolé impossible de récupérer les infos couleur");
                q.reject(err);
              });

    return q.promise;
  }

  var setConfig = function (settings) {
    var q = $q.defer();

    RiseboxApi.setLightSettings( RiseboxObj.getToken(),
                                 RiseboxObj.getInfo().devices[0].key,
                                 settings)
              .then(function() {
                q.resolve();
              }, function(err) {
                console.log("Désolé impossible de mettre à jour la config de lumière");
                q.reject(err);
              });

    return q.promise;
  }

  var setRecipe = function (level, recipe) {
    return setConfig(settingsForRecipe(level, recipe));
  }

  var settingsForRecipe = function(level, recipe){
    var result = {};
    if (recipe == 'grow') {
      result[level+'_blue'] = growBlueRatio ;
      result[level+'_red'] = growRedRatio ;
      result[level+'_white'] = growWhiteRatio
    }
    else {
      if (recipe == 'bloom') {
        result[level+'_blue'] = bloomBlueRatio ;
        result[level+'_red'] = bloomRedRatio ;
        result[level+'_white'] = bloomWhiteRatio
      }
      else {
        if (recipe == 'chill') {
          result[level+'_blue'] = chillBlueRatio ;
          result[level+'_red'] = chillRedRatio ;
          result[level+'_white'] = chillWhiteRatio
        }
      }
    }
    return result;
  }

  var cleanSettings = function(raw_settings) {
    var cleanSettings = {};
    raw_settings.forEach(function(setting) {
      cleanSettings[setting.key] = setting.value;
    });
    _settings = cleanSettings;
  }

  var computeRecipes = function() {
    computeLevelRecipe('upper');
    computeLevelRecipe('lower');
  }

  var computeLevelRecipe = function(level) {
    if (isGrowing(level)) { _config[level + '_recipe'] = 'grow'}
      else { if (isBlooming(level)) { _config[level + '_recipe'] = 'bloom' }
        else { if (isChilling(level)) { _config[level + '_recipe'] = 'chill' } else {
          _config[level + '_recipe'] = 'custom'
        }
      }
    }
  }

  var isGrowing = function(level) {
    return (_settings[level+'_red'] == growRedRatio && _settings[level+'_blue'] == growBlueRatio && _settings[level+'_white'] == growWhiteRatio);
  }

  var isBlooming = function(level) {
    return (_settings[level+'_red'] == bloomRedRatio && _settings[level+'_blue'] == bloomBlueRatio && _settings[level+'_white'] == bloomWhiteRatio);
  }

  var isChilling = function(level) {
    return (_settings[level+'_red'] == chillRedRatio && _settings[level+'_blue'] == chillBlueRatio && _settings[level+'_white'] == chillWhiteRatio);
  }

  var setGrowing = function(level) {
    var h = {}; h[level+'_red'] = growRedRatio ; h[level+'_blue'] = growBlueRatio ; h[level+'_white'] = growWhiteRatio; return h;
  }

  var setBlooming = function(level) {
    var h = {}; h[level+'_red'] = bloomRedRatio ; h[level+'_blue'] = bloomBlueRatio ; h[level+'_white'] = bloomWhiteRatio; return h;
  }

  var setChilling = function(level) {
    var h = {}; h[level+'_red'] = chillRedRatio ; h[level+'_blue'] = chillBlueRatio ; h[level+'_white'] = chillWhiteRatio; return h;
  }

  var settingsForEvent = function(event, hours, minutes) {
    var h = {};
    if (event == 'sunrise'){
      h['day_hours'] = hours;
      h['day_minutes'] = minutes;
    } else {
      if (event == 'sunset'){
        h['night_hours'] = hours;
        h['night_minutes'] = minutes;
      }
    }
    return h
  }

  var setSchedule = function (evt, hour, minutes) {
    return setConfig(settingsForEvent(evt, hour, minutes));
  }

  var computeSchedules = function() {
    _config['sunrise'] = {hours: _settings['day_hours'], minutes: _settings['day_minutes']};
    _config['sunset']  = {hours: _settings['night_hours'], minutes: _settings['night_minutes']};
  }

  return {
    getConfig: getConfig,
    setRecipe: setRecipe,
    setSchedule: setSchedule
  }
})

;