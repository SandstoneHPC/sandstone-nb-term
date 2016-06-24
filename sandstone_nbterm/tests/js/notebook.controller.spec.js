describe('bashnotebook', function(){

  var controller;
  var httpBackend;
  var $compile;
  var nbService;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.editor'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.templates'));
  beforeEach(module('sandstone.filetreedirective'));

  beforeEach(inject(function($controller, $rootScope, $log, $document, $httpBackend, _$compile_, $modal, NotebookService){
    scope = $rootScope.$new();
    $compile = _$compile_;
    httpBackend = $httpBackend;
    nbService = NotebookService;
    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      return [200, dirs];
    });
    controller = $controller;
    controller = $controller('NotebookCtrl', {
      $scope: scope,
      $document: $document,
      $log: $log,
      NotebookService: NotebookService,
      $modal: $modal
    });
    scope.ctrl = controller;
    scope.$apply();
  }));

  describe('Notebook Controller', function(){
    it('should initialize the directive properly', function(){
      var element = angular.element('<div sandstone-filetree tree-data="ctrl.treeData" leaf-level="file" selection-desc="ctrl.sd"></div>');
      el = $compile(element)(scope);
      scope.$digest();
      expect(scope.ctrl.cellsObj).toBeDefined();
      expect(scope.ctrl.nbFile).toBeDefined();
      expect(scope.ctrl.nbFile.filepath).toBe('-');
      expect(scope.ctrl.nbFile.filename).toBe('Untitled');
      expect(scope.ctrl.unsaved).not.toBeTruthy();
    });

    it('should start a kernel', function(){
      var element = angular.element('<div sandstone-filetree tree-data="ctrl.treeData" leaf-level="file" selection-desc="ctrl.sd"></div>');
      el = $compile(element)(scope);
      scope.$digest();
      // create spy on notebook service method
      spyOn(nbService, 'startKernel');
      scope.ctrl.startKernel();
      expect(nbService.startKernel).toHaveBeenCalled();
    });

    it('should stop a kernel', function(){
      var element = angular.element('<div sandstone-filetree tree-data="ctrl.treeData" leaf-level="file" selection-desc="ctrl.sd"></div>');
      el = $compile(element)(scope);
      scope.$digest();
      // create spy on stop kernel
      spyOn(nbService, 'stopKernel');
      scope.ctrl.stopKernel();
      expect(nbService.stopKernel).toHaveBeenCalled();
    });

  });

});
