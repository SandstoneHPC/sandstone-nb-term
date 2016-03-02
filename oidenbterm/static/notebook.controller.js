'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$scope','NbNotebookService',function($scope,NbNotebookService) {
  var self = this;

  self.cells = [];
  self.runQueue = [];

  $scope.$watchCollection('self.runQueue', function() {
    angular.forEach(self.cells, function(c) {
      // Execute through the stack.
      self.cells.splice(0,1);
      NbNotebookService.executeCodeCell(c);
    });
  });

  self.startKernel = function() {
    NbNotebookService.startKernel();
  };

  self.stopKernel = function() {
    NbNotebookService.stopKernel();
  };

}]);
