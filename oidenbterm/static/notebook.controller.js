'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$http', function($http) {
  var self = this;

  self.executeCode = function() {
    $http({
      url: '/nbterm/a/kernel/execute',
      method: 'POST',
      data: {
        code: "print 'Hello, World'"
      },
      params: {
        _xsrf:getCookie('_xsrf')
      }
    }).success(function(data){
      console.log(data);
    });
  }


}]);
