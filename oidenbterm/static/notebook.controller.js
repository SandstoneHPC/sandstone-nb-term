'use strict';

angular.module('oide.nbterm')

.controller('NotebookCtrl', ['$scope','$log','$modal','NotebookService',function($scope,$log,$modal,NotebookService) {
  var self = this;

  self.cellsObj = NotebookService.cellsObj;
  self.runQueue = [];
  self.kernelStatus = NotebookService.getKernelStatus;
  self.nbFile = {
    filepath: '-',
    filename: 'Untitled'
  };

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
      self.nbFile.filepath = newFile.filepath;
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
  $scope.treeData = {};
  var initialContents = $http
    .get('/filebrowser/filetree/a/dir')
    .success(function(data, status, headers, config) {
      for (var i=0;i<data.length;i++) {
        data[i].children = [];
      }
      $scope.treeData.filetreeContents = data;
    }).
    error(function(data, status, headers, config) {
      $log.error('Failed to initialize filetree.');
    });
    $scope.getDirContents = function (node,expanded) {
      $http
        .get('/filebrowser/filetree/a/dir', {
          params: {
            dirpath: node.filepath
          }
        }).
        success(function(data, status, headers, config) {
          for (var i=0;i<data.length;i++) {
            if (!data[i].hasOwnProperty('children')) {
              data[i].children = [];
            }
          }
          node.children = data;
        }).
        error(function(data, status, headers, config) {
          $log.error('Failed to grab dir contents from ',node.filepath);
        });
  };
  $scope.newFile = {};
  $scope.invalidFilepath = true;
  $scope.updateSelection = function (node, selected) {
    var index = node.filepath.lastIndexOf('/')+1;
    var filepath = node.filepath.substring(0,index);
    var filename = node.filepath.substring(index,node.filepath.length);
    var fileExtension = '';
    if (filename.length >= 7) {
      fileExtension = filename.substring(filename.length-6,filename.length);
    }
    if (fileExtension === '.ipynb') {
      $scope.newFile.filepath = node.filepath;
      $scope.invalidFilepath = false;
    }
  };
  $scope.treeOptions = {
    multiSelection: false,
    isLeaf: function(node) {
      return node.type !== 'dir';
    },
    injectClasses: {
      iExpanded: "filetree-icon fa fa-folder-open",
      iCollapsed: "filetree-icon fa fa-folder",
      iLeaf: "filetree-icon fa fa-file",
    }
  };

  $scope.open = function () {
    $modalInstance.close($scope.newFile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('SaveAsModalCtrl', function ($scope, $modalInstance, $http, file) {
  $scope.treeData = {};
  var initialContents = $http
    .get('/filebrowser/filetree/a/dir')
    .success(function(data, status, headers, config) {
      for (var i=0;i<data.length;i++) {
        data[i].children = [];
      }
      $scope.treeData.filetreeContents = data;
    }).
    error(function(data, status, headers, config) {
      $log.error('Failed to initialize filetree.');
    });
    $scope.getDirContents = function (node,expanded) {
      $http
        .get('/filebrowser/filetree/a/dir', {
          params: {
            dirpath: node.filepath
          }
        }).
        success(function(data, status, headers, config) {
          for (var i=0;i<data.length;i++) {
            if (!data[i].hasOwnProperty('children')) {
              data[i].children = [];
            }
          }
          node.children = data;
        }).
        error(function(data, status, headers, config) {
          $log.error('Failed to grab dir contents from ',node.filepath);
        });
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
  }
  $scope.newFile.filename = file.filename;
  $scope.newFile.oldFilename = file.filename;
  $scope.newFile.oldFilepath = file.filepath;
  $scope.updateSaveName = function (node, selected) {
    $scope.invalidFilepath = false;
    if (node.type === 'dir') {
      $scope.newFile.filepath = node.filepath;
    } else {
      var index = node.filepath.lastIndexOf('/')+1;
      var filepath = node.filepath.substring(0,index);
      var filename = node.filepath.substring(index,node.filepath.length);
      $scope.newFile.filepath = filepath;
      $scope.newFile.filename = filename;
    }
  };
  $scope.treeOptions = {
    multiSelection: false,
    isLeaf: function(node) {
      return node.type !== 'dir';
    },
    injectClasses: {
      iExpanded: "filetree-icon fa fa-folder-open",
      iCollapsed: "filetree-icon fa fa-folder",
      iLeaf: "filetree-icon fa fa-file",
    }
  };

  $scope.saveAs = function () {
    $scope.newFile.filepath = $scope.newFile.filepath+$scope.newFile.filename;
    $modalInstance.close($scope.newFile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
