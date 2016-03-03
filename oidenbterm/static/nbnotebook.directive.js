'use strict';

angular.module('oide.nbterm')

.directive('nbNotebook', [function() {
  return {
    restrict: 'A',
    scope: {
      kernelName: '@',
      cells: '=',
      runQueue: '='
    },
    templateUrl: '/static/nbterm/templates/nb-notebook.html',
    controller: function($scope,$element,$timeout) {
      $scope.cellTypes = [
        {id:'markdown',name:'Markdown'},
        {id:'code',name:'Code'},
        {id:'heading',name:'Heading'}
      ];
      
      if ($scope.kernelName=='bash') {
        $scope.modeName = 'sh';
      } else {
        $scope.modeName = $scope.kernelName;
      }

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
        var newCell = createNewCell('code');
        var index = $scope.cells.indexOf(cell);
        $scope.cells.splice(index-1, 0, newCell);
        $scope.setActive(newCell);
      };
      $scope.insertCellBelow = function(cell) {
        var newCell = createNewCell('code');
        var index = $scope.cells.indexOf(cell);
        $scope.cells.splice(index+1, 0, newCell);
        $scope.setActive(newCell);
      };
      $scope.runAllCellsAbove = function(cell) {
        var index = $scope.cells.indexOf(cell);
        for (var i=0;i<index;i++) {
          $scope.runCell($scope.cells[i]);
        }
      };
      $scope.runCell = function(cell) {
        if (cell.type === 'markdown') {
          cell.showOutput = false;
          cell.editing = false;
          cell.hasExecuted = true;
        } else {
          cell.hasExecuted = false;
          cell.running = true;
          cell.showOutput = true;
          $scope.runQueue.push(cell);
        }
        // Post-Run
        var index = $scope.cells.indexOf(cell);
        if (index === $scope.cells.length-1) {
          // Insert new cell at end of notebook
          $scope.insertCellBelow(cell);
        } else {
          // Set the next cell as active
          $scope.setActive($scope.cells[index+1]);
        }
      };
      var createNewCell = function(cellType) {
        return {
          type: cellType
        };
      };

      if ($scope.cells.length===0) {
        var firstCell = createNewCell('code');
        $scope.cells.push(firstCell);
      }
    }
  };
}]);
