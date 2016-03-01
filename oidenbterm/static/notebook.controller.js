'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', [function() {
  var self = this;

  self.cells = [
    {
      type:'code',
      isActive:true,
    },{
      type:'code'
    },{
      type:'markdown'
    },{
      type:'markdown',
      input: '__HI__ this is a *test*!!'
    },{
      type:'markdown',
      input: '__HI__ this is __another__ a *test*!!'
    }];
}]);
