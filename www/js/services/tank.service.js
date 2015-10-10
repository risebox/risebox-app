angular.module('risebox.services')

.factory('Tank', function($q, RiseboxObj, RiseboxApi) {

  var getMetrics = function () {
    var q = $q.defer();

    RiseboxApi.getTankMetrics( RiseboxObj.getInfo().device.key,
                               RiseboxObj.getInfo().device.token)
              .then(function(result) {
                var m = cleanMetrics(result.result);
                q.resolve(m);
              }, function(err) {
                console.log("Désolé impossible de récupérer les métriques du tank");
                q.reject(err);
              });

    return q.promise;
  }

  var cleanMetrics = function(raw_metrics) {
    var cleanedM = {};
    raw_metrics.forEach(function(metric) {
      cleanedM[metric.code] = {value: metric.value};
    });
    return cleanedM;
  }

  return {
    getMetrics: getMetrics
  }

});