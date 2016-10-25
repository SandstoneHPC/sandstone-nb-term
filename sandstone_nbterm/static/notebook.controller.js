'use strict';

angular.module('sandstone.nbterm')

.controller('NotebookCtrl', ['$scope','$log','$modal','NotebookService',function($scope,$log,$modal,NotebookService) {
  var self = this;

  self.initialize = function() {
    self.cellsObj = NotebookService.cellsObj;
    self.runQueue = [];
    self.kernelStatus = NotebookService.getKernelStatus;
    self.nbFile = {
      filepath: '-',
      filename: 'Untitled'
    };
    self.unsaved = false;
  };

  self.reset = function () {
    self.nbFile = {
      filepath: '-',
      filename: 'Untitled'
    };
    self.cellsObj.cells = [];
    self.runQueue = [];
    self.unsaved = false;
  };

  self.initialize();

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

  $scope.$watch(function(){
    return NotebookService.getKernelStatus;
  }, function(newVal){
    self.kernelStatus = newVal;
  });

  self.startKernel = function() {
    NotebookService.startKernel();
  };

  self.stopKernel = function() {
    NotebookService.stopKernel();
  };

  self.newNotebook = function() {
    if(self.unsaved) {
      var unsavedModalInstance = $modal.open({
        templateUrl: '/static/nbterm/templates/close-unsaved-modal.html',
        backdrop: 'static',
        keyboard: false,
        controller: 'UnsavedModalCtrl',
        resolve: {
          file: function() {
            return self.nbFile;
          }
        }
      });

      unsavedModalInstance.result.then(function(file){
        if(file.saveFile) {
          self.saveNotebook();
          self.reset();
        } else {
          self.reset();
        }
      });

    } else {
      self.reset();
    }
  };

  self.openNotebook = function() {
    var openModalInstance = $modal.open({
      templateUrl: '/static/nbterm/templates/open-modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller: 'OpenModalCtrl',
      resolve: {
        file: function () {
          return self.nbFile;
        }
      }
    });
    openModalInstance.result.then(function(newFile) {
      self.nbFile.filepath = newFile;
      NotebookService.openNotebook(self.nbFile.filepath);
      $log.debug('Opened files at ' + new Date());
    }, function() {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };

  self.saveNotebook = function() {
    if (self.nbFile.filepath==='-') {
      var saveAsModalInstance = $modal.open({
          templateUrl: '/static/nbterm/templates/saveas-modal.html',
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          controller: 'SaveAsModalCtrl',
          resolve: {
            file: function () {
              return self.nbFile;
            }
          }
        });

      saveAsModalInstance.result.then(function (newFile) {
        NotebookService.saveNotebook(self.cellsObj.cells,newFile.filepath);
        $log.debug('Saved files at: ' + new Date());
      }, function () {
        $log.debug('Modal dismissed at: ' + new Date());
      });
    } else {
      NotebookService.saveNotebook(self.cellsObj.cells,self.nbFile.filepath);
    }
  };
}])
.controller('OpenModalCtrl', function ($scope, $modalInstance, $http, file) {
  $scope.treeData = {
    filetreeContents: [],
    selectedNodes: []
  };

  $scope.loadFile = {
    filename: '',
    filepath: '-/'
  }
  $scope.invalidFilepath = true;

  $scope.$watch(function(){
    return $scope.treeData.selectedNodes;
  }, function(newValue){
    if ((newValue.length > 0) && (newValue[0].type === 'file')) {
      $scope.loadFile.filename = newValue[0].filename;
      $scope.loadFile.filepath = newValue[0].filepath.replace(newValue[0].filename,'');
      $scope.invalidFilepath = false;
    }
  });

  $scope.loadScript = function () {
    var filepath = $scope.loadFile.filepath + $scope.loadFile.filename;
    $modalInstance.close(filepath);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('SaveAsModalCtrl', function ($scope, $modalInstance, $http, file) {
  $scope.treeData = {
    filetreeContents: [],
    selectedNodes: []
  };

  $scope.newFile = {};
  $scope.invalidFilepath = false;
  if (file.filepath.substring(0,1) === '-') {
    $scope.newFile.filepath = '-/';
    $scope.invalidFilepath = true;
  } else {
    var index = file.filepath.lastIndexOf('/')+1;
    var filepath = file.filepath.substring(0,index);
    $scope.newFile.filepath = filepath;
    $scope.invalidFilepath = false;
  }
  $scope.newFile.filename = file.filename;
  $scope.newFile.oldFilename = file.filename;
  $scope.newFile.oldFilepath = file.filepath;

  $scope.$watch(function(){
    return $scope.treeData.selectedNodes;
  }, function(newValue){
    if(newValue.length > 0) {
      if (newValue[0].type === 'file') {
        $scope.newFile.filename = newValue[0].filename;
        $scope.newFile.filepath = newValue[0].filepath.replace(newValue[0].filename,'');
      } else {
        $scope.newFile.filepath = newValue[0].filepath;
        if (newValue[0].filepath.substr(newValue[0].filepath.length-1) !== '/') {
          $scope.newFile.filepath = $scope.newFile.filepath + '/';
        }
      }
    }
    $scope.updateSaveName();
  });

  $scope.updateSaveName = function () {
    if (($scope.newFile.filepath.substr(0,1) !== '-') && $scope.newFile.filename) {
      $scope.invalidFilepath = false;
    }
  };

  $scope.saveAs = function () {
    $scope.newFile.filepath = $scope.newFile.filepath + $scope.newFile.filename;
    $modalInstance.close($scope.newFile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('UnsavedModalCtrl', function ($scope, $modalInstance, file) {
  $scope.file = file;

  $scope.save = function () {
    $scope.file.saveFile = true;
    $modalInstance.close($scope.file);
  };

  $scope.close = function () {
    $scope.file.saveFile = false;
    $modalInstance.close($scope.file);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
