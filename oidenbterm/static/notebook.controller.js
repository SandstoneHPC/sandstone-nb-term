'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', [function() {
  var self = this;

  self.cells = [
    {
      type:'code',
      isActive:true,
      hasExecuted:true
    },{
      type:'code'
    },{
      type:'markdown'
    },{
      type:'markdown',
      hasExecuted: true
    },{
      type:'markdown',
      isActive: true,
      hasExecuted: true
    }];
}]);
