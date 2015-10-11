angular.module('risebox.controllers')

.controller('GrowbedStatusCtrl', function($ionicPopup, $scope, Growbed) {

    var metricsRetrievalSuccess = function(result){
      $scope.metrics = result;
    }

    var metricsRetrievalError = function(err){
      console.log("Désolé impossible de récupérer les métriques")
    }

    $scope.getGrowbedMetrics = function(){
      Growbed.getMetrics()
          .then(function(result) {
            metricsRetrievalSuccess(result);
          }, function(err) {
            metricsRetrievalError(err);
          });
    }

    $scope.getGrowbedMetrics();

    $scope.headerSpace = (ionic.Platform.isIOS() === true ? 'big' : 'small');
});