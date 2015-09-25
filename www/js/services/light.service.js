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

  var darkModeSettingName = 'no_lights_until';
  var darkModeDuration = 10;

  var addMinutes = function (minutes) {
    var now = new Date().getTime();
    return new Date(now + minutes*60000).getTime();
  }

  var getConfig = function () {
    var q = $q.defer();

    RiseboxApi.getLightSettings( RiseboxObj.getInfo().device.key,
                                 RiseboxObj.getInfo().device.token)
              .then(function(result) {
                cleanSettings(result.result);
                computeRecipes();
                computeDarkMode();
                q.resolve(_config);
              }, function(err) {
                console.log("Désolé impossible de récupérer les infos couleur");
                q.reject(err);
              });

    return q.promise;
  }

  var setConfig = function (settings) {
    var q = $q.defer();

    RiseboxApi.setLightSettings( RiseboxObj.getInfo().device.key,
                                 RiseboxObj.getInfo().device.token,
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

  var temporaryOff = function(){
    var h = {};
    h[darkModeSettingName] = parseInt(addMinutes(darkModeDuration)/1000); //because server epoch is in seconds not ms
    return setConfig(h);
  }

  var on = function(){
    var h = {};
    h[darkModeSettingName] = null;
    return setConfig(h);
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

  var computeDarkMode = function() {
    endDate = Date.parse(_settings[darkModeSettingName]);
    now = new Date();
    if (endDate == null) {
      _config['dark_mode'] = false;
    } else {
      if (endDate <= now){
        _config['dark_mode'] = false;
      } else {
        _config['dark_mode'] = true;
      }
    }
  }

  return {
    getConfig: getConfig,
    setRecipe: setRecipe,
    on: on,
    temporaryOff: temporaryOff
  }
})

;