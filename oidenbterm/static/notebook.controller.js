'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', [function() {
  var self = this;

  self.cells = [{isActive:true,hasExecuted:true},{}];
}]);
