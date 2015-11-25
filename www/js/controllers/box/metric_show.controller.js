angular.module('risebox.controllers')

.controller('MetricShowCtrl', function($ionicPopup, $scope, $stateParams, $window, RiseboxApi, RiseboxObj) {

    var metricReport = null;

    var initGraphic = function(result){
      console.log('result');
      console.log(result);
      $scope.reportName = "Evolution de " + $stateParams.metric_key;
      $scope.metricKey = $stateParams.metric_key;

      legend      = {"taken_at": "Remonté le", "value": "Valeur mesurée"};
      reportTitle = $scope.reportName;

      metricReport = new MetricReport("#report", $scope.dev_height/2, $scope.dev_width-20, reportTitle, onGraphPointClick, onGraphPointRelease);

      refreshGraphic(result);
    }

    var onGraphPointClick = function(value, timeStamp){
      $ionicPopup.alert({
        title: 'Value selected',
        template: 'Value: '+ value +'<br/>Timestamp: '+ new Date(timeStamp)
      });
    }

    var onGraphPointRelease = function(){

    }

    var refreshGraphic = function(result){
      console.log('refresh result');
      console.log(result);

      var reportData = {"legend": legend, "data": result.result};
      metricReport.display(reportData);
    }

    var measuresRetrievalError = function(err){
      console.log("Désolé impossible de récupérer les données");
    }

    var secondsAgoForTimeFrame = function(timeFrame){
      var now        = (new Date).getTime()/1000;
      var oneHour    = 60 * 60;
      var oneHourAgo = now - oneHour;
      var oneDay     = oneHour * 24;
      var oneDayAgo  = now - oneDay;
      var oneWeek     = oneDay * 7;
      var oneWeekAgo  = now - oneWeek;

      if (timeFrame == "hour"){
        return oneHourAgo;
      } else {
        if (timeFrame == "day"){
          return oneDayAgo;
        } else {
          return oneWeekAgo;
        }
      }
    }

    $scope.initData = function(timeFrame) {
      $scope.timeFrame = timeFrame
      RiseboxApi.getMeasures(RiseboxObj.getToken(),
                                RiseboxObj.getInfo().devices[0].key,
                                $stateParams.metric_key,
                                {'since': secondsAgoForTimeFrame(timeFrame)})
                    .then(function(result) {
                      initGraphic(result);
                    }, function(err) {
                      measuresRetrievalError(err);
                    });
    };

    $scope.refreshData = function(timeFrame) {
      $scope.timeFrame = timeFrame
      RiseboxApi.getMeasures(RiseboxObj.getToken(),
                                RiseboxObj.getInfo().devices[0].key,
                                $stateParams.metric_key,
                                {'since': secondsAgoForTimeFrame(timeFrame)})
                    .then(function(result) {
                      refreshGraphic(result);
                    }, function(err) {
                      measuresRetrievalError(err);
                    });
    }

    $scope.calculateDimensions = function(gesture) {
      $scope.dev_width = $window.innerWidth;
      $scope.dev_height = $window.innerHeight;
    }

    angular.element($window).bind('resize', function(){
      $scope.$apply(function() {
        $scope.calculateDimensions();
      })
    });

    $scope.calculateDimensions();
    $scope.initData('hour');
})

;