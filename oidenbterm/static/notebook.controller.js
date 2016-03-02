'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$scope','NotebookService',function($scope,NotebookService) {
  var self = this;

  self.cells = [];
  self.runQueue = [];

  $scope.$watchCollection('self.runQueue', function() {
    angular.forEach(self.cells, function(c) {
      // Execute through the stack.
      self.cells.splice(0,1);
      NotebookService.executeCodeCell(c);
    });
  });

  self.startKernel = function() {
    NotebookService.startKernel();
  };

  self.stopKernel = function() {
    NotebookService.stopKernel();
  };

}]);
