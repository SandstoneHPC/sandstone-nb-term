'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$http', function($http) {
  var self = this;

  self.cells = [];

  self.executeCode = function() {
    $http({
      url: '/nbterm/a/kernel/execute',
      method: 'POST',
      data: {
        code: "print 'Hello, World'",
        operation: 'EXECUTE_CODE'
      },
      params: {
        _xsrf:getCookie('_xsrf')
      }
    }).success(function(data){
      console.log(data);
    });
  };
  
  self.shutdownKernel = function() {
    $http({
      url: '/nbterm/a/kernel/execute',
      method: 'POST',
      data: {
        operation: 'SHUTDOWN_KERNEL'
      },
      params: {
        _xsrf:getCookie('_xsrf')
      }
    }).success(function(data){
      console.log(data);
    });
  };
}]);
