angular.module('risebox.services')

.factory('RiseboxConf', function($localstorage) {
  var storageKey = 'risebox-config';
  var _config = null;
  var envConfig      = {  'dev': 
                          { 'RISEBOX_API_ENDPOINT': 'https://rbdev-api.herokuapp.com',
                            'IONIC_DEPLOY_CHANNEL': 'dev' ,
                            'STRIP_WAITING_TIME' : 3},
                          'prod':
                          { 'RISEBOX_API_ENDPOINT': 'https://risebox-api.herokuapp.com',
                            'IONIC_DEPLOY_CHANNEL': 'prod',
                            'STRIP_WAITING_TIME': 60 }
                       }
  var configOptions = {'RISEBOX_API_ENDPOINT': ['https://rbdev-api.herokuapp.com', 'https://risebox-api.herokuapp.com'],
                       'IONIC_DEPLOY_CHANNEL': ['dev', 'prod']
                       }

  var load = function() {
    _config = $localstorage.getObject(storageKey);
    if (Object.keys(_config).length === 0){
      init('prod');
    }
  }

  var init = function(env) {
    _config = envConfig[env];
    _config['env'] = env;
    save();
  }

  var save = function() {
    $localstorage.setObject(storageKey, _config);
    _config;
  }

  var get = function(key) {
    return _config[key];
  }

  var set = function(key, value) {
    _config[key] = value;
  }

  var options = function(){
    return configOptions;
  }

  var option = function(key){
    return configOption[key];
  }

  load();

  return {
    init: init,
    get: get,
    set: set,
    save: save
  };

});