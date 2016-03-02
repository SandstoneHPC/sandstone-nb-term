'use strict';

angular.module('oide.nbterm')

.factory('NotebookService', ['$http','$log',function($http,$log) {
  return {
    startKernel: function() {
      // Just a stub.
    },
    stopKernel: function() {
      $http({
        url: '/nbterm/a/kernel/execute',
        method: 'POST',
        data: {
          operation: 'SHUTDOWN_KERNEL'
        },
        params: {
          _xsrf: getCookie('_xsrf')
        }
      }).success(function(data){
        $log.log(data);
      });
    },
    executeCodeCell: function(cell) {
      $log.log(cell);
      $http({
        url: '/nbterm/a/kernel/execute',
        method: 'POST',
        data: {
          code: cell.input,
          operation: 'EXECUTE_CODE'
        },
        params: {
          _xsrf: getCookie('_xsrf')
        }
      }).success(function(data){
        $log.log(data);
        cell.output = data.res[1].text;
        cell.running = false;
        cell.hasExecuted = true;
      });
    }
  };
}]);
