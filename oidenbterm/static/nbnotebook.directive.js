'use strict';

angular.module('oide.nbterm')

.directive('nbNotebook', [function() {
  return {
    restrict: 'A',
    scope: {
      kernelName: '@',
      cells: '=',
      kernelStatus: '='
    },
    templateUrl: '/static/nbterm/templates/nb-notebook.html',
    controller: function($scope,$element) {
      $scope.cellTypes = [
        {id:'markdown',name:'Markdown'},
        {id:'code',name:'Code'},
        {id:'heading',name:'Heading'}
      ];
      $scope.setActive = function(cell) {
        angular.forEach($scope.cells, function(c) {
          c.isActive = false;
        });
        cell.isActive = true;
      };
      $scope.deleteCell = function(cell) {
        var index = $scope.cells.indexOf(cell);
        $scope.cells.splice(index,1);
      };
      $scope.insertCellAbove = function(cell) {
        var index = $scope.cells.indexOf(cell);
        var newCell = createNewCell('code');
        $scope.cells.splice(index-1, 0 , newCell);
        $scope.setActive(newCell);
      };
      $scope.insertCellBelow = function(cell) {
        var index = $scope.cells.indexOf(cell);
        var newCell = createNewCell('code');
        $scope.cells.splice(index+1, 0 , newCell);
        $scope.setActive(newCell);
      };
      $scope.runCell = function(cell) {
        $scope.kernelStatus = 'busy';
        // Eventually, the nb service will set the output
        // on the model, and then revert its status to 'idle'.
        $scope.kernelStatus = 'idle';
        cell.hasExecuted = true;
        cell.output = 'This code ran!';
      };
      var createNewCell = function(cellType) {
        return {
          type: cellType
        };
      };
    }
  };
}]);
