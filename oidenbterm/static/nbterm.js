'use strict';

angular.module('oide.nbterm', ['ui.ace','hc.marked'])

.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('nbterm', {
      url: '/nbterm',
      views: {
        '': {
          templateUrl: '/static/nbterm/nbterm.html'
        },
        'terminal@nbterm': {
          templateUrl: '/static/nbterm/templates/terminal.html',
          controller: 'TerminalCtrl as ctrl'
        },
        'notebook@nbterm': {
          templateUrl: '/static/nbterm/templates/notebook.html',
          controller: 'NotebookCtrl as ctrl'
        }
      }
    });
}]);
