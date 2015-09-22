angular.module('risebox.services')

.factory('Light', function($q, RiseboxObj, RiseboxApi) {

  var _settings       = {};
  var _status         = {};

  var growRedRatio    = 40;
  var growBlueRatio   = 60;
  var growWhiteRatio  =  0;

  var bloomRedRatio   = 60;
  var bloomBlueRatio  = 40;
  var bloomWhiteRatio =  0;

  var chillRedRatio   =   0;
  var chillBlueRatio  =   0;
  var chillWhiteRatio = 100;

  var getStatus = function () {
    var q = $q.defer();

    RiseboxApi.getLightSettings( RiseboxObj.getInfo().device.key,
                                 RiseboxObj.getInfo().device.token)
              .then(function(result) {
                cleanSettings(result.result);
                computeStatus();
                q.resolve(_status);
              }, function(err) {
                console.log("Désolé impossible de récupérer les infos couleur");
                q.reject(err);
              });

    return q.promise;
  }

  var setStatus = function (level, status) {
    var q = $q.defer();

    var toUpdateSettings = settingsForStatus(level, status);
    RiseboxApi.setLightSettings( RiseboxObj.getInfo().device.key,
                                 RiseboxObj.getInfo().device.token,
                                 toUpdateSettings)
              .then(function() {
                q.resolve();
              }, function(err) {
                console.log("Désolé impossible de mettre à jour les infos couleur");
                q.reject(err);
              });

    return q.promise;
  }

  var settingsForStatus = function(level, status){
    var result = {};
    if (status == 'grow') {
      result[level+'_blue'] = growBlueRatio ;
      result[level+'_red'] = growRedRatio ;
      result[level+'_white'] = growWhiteRatio
    }
    else {
      if (status == 'bloom') {
        result[level+'_blue'] = bloomBlueRatio ;
        result[level+'_red'] = bloomRedRatio ;
        result[level+'_white'] = bloomWhiteRatio
      }
      else {
        if (status == 'chill') {
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

  var computeStatus = function() {
    computeLevelStatus('upper');
    computeLevelStatus('lower');
  }

  var computeLevelStatus = function(level) {
    if (isGrowing(level)) { _status[level] = 'grow'}
      else { if (isBlooming(level)) { _status[level] = 'bloom' }
        else { if (isChilling(level)) { _status[level] = 'chill' } else {
          _status[level] = 'custom'
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

  return {
    getStatus: getStatus
    ,
    setStatus: setStatus
  }
})

;