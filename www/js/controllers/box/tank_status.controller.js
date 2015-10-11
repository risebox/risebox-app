angular.module('risebox.controllers')

.controller('TankStatusCtrl', function($ionicPopup, $scope, Tank) {

    var metricsRetrievalSuccess = function(result){
      $scope.metrics = result;
    }

    var metricsRetrievalError = function(err){
      console.log("Désolé impossible de récupérer les métriques")
    }

    $scope.getTankMetrics = function(){
      Tank.getMetrics()
          .then(function(result) {
            metricsRetrievalSuccess(result);
          }, function(err) {
            metricsRetrievalError(err);
          });
    }

    $scope.getTankMetrics();

    $scope.headerSpace = (ionic.Platform.isIOS() === true ? 'big' : 'small');
});