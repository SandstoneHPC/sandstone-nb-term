'use strict';

angular.module('oide.nbterm')

.directive('nbNotebook', [function() {
  return {
    restrict: 'A',
    scope: {
      kernelName: '@',
      cells: '='
    },
    templateUrl: '/static/nbterm/templates/nb-notebook.html',
    controller: function($scope,$element) {
      $scope.cellTypes = [
        {id:'markdown',name:'Markdown'},
        {id:'code',name:'Code'},
        {id:'heading',name:'Heading'}
      ];
    }
  };
}]);
