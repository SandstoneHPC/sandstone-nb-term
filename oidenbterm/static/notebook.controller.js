'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$http', function($http) {
  var self = this;

  self.cells = [];

  // self.executeCode = function() {
  //   $http({
  //     url: '/nbterm/a/kernel/execute',
  //     method: 'POST',
  //     params: {
  //       _xsrf:getCookie('_xsrf'),
  //       code: "print 'Hello, World'"
  //     }
  //   }).success(function(data){
  //     console.log(data);
  //   });
  // }
}]);
