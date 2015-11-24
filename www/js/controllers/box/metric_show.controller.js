angular.module('risebox.controllers')

.controller('MetricShowCtrl', function($scope, $stateParams, $window, RiseboxApi, RiseboxObj) {
    var refreshGraphic = function(result){
      console.log('result');
      console.log(result);
      $scope.measures = result.result;
      $scope.reportName = "Evolution de " + $stateParams.metric_key;
      $scope.metricKey = $stateParams.metric_key;

      data        = $scope.measures;
      legend      = {"taken_at": "Remonté le", "value": "Valeur mesurée"};
      dates       = [];  //Convert Dates in Unix time
      reportTitle = $scope.reportName;

      reportData   = {"legend": legend, "data": data};
      angular.element(document).find("#report").empty();
      displayMetricReport(reportData, dates, "#report", $scope.dev_height/2, $scope.dev_width-20, reportTitle);
    }

    var failFct = function(err){
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

    $scope.refreshData = function(timeFrame) {
      $scope.timeFrame = timeFrame
      RiseboxApi.getMeasures(RiseboxObj.getToken(),
                                RiseboxObj.getInfo().devices[0].key,
                                $stateParams.metric_key,
                                {'since': secondsAgoForTimeFrame(timeFrame)})
                    .then(function(result) {
                      refreshGraphic(result);
                    }, function(err) {
                      failFct(err);
                    });
    };

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
    $scope.refreshData('hour');
})

;