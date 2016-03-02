'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$scope','NotebookService',function($scope,NotebookService) {
  var self = this;

  self.cells = [];
  self.runQueue = [];

  $scope.$watchCollection(
    function(scope) {
      return scope.ctrl.runQueue;
    },
    function(newVal, oldVal) {
      if (newVal.length > 0) {
        var c = newVal.splice(0,1);
        NotebookService.executeCodeCell(c[0]);
      }
  });

  self.startKernel = function() {
    NotebookService.startKernel();
  };

  self.stopKernel = function() {
    NotebookService.stopKernel();
  };

}]);
