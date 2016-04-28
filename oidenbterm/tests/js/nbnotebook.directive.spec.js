describe('nbNotebook directive', function(){
  var compile;
  var scope;
  var element;
  var httpBackend;
  var isolateScope;

  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));
  beforeEach(module('oide.templates'));
  beforeEach(module('oide.nbterm'));
  beforeEach(module('oide.filesystemservice'));
  // beforeEach(module('/static/nbterm/templates/notebook.html'));

  beforeEach(inject(function($rootScope, $compile, $httpBackend){
    compile = $compile;
    scope = $rootScope.$new();

    httpBackend = $httpBackend;

    var el = angular.element('<div nb-notebook kernel-name="bash" cells="ctrl.cellsObj.cells" run-queue="ctrl.runQueue" unsaved="ctrl.unsaved"></div>');
    element = $compile(el)(scope);
    scope.$digest();
    isolateScope = element.isolateScope();
  }));

  describe('notebook tests', function(){
    it('directive should be initialized', function(){
      expect(isolateScope).toBeDefined();
      expect(isolateScope.cells.length).toBe(1);
      expect(isolateScope.kernelName).toBe("bash");
    });

    it('should insert a cell above', function(){
      var cell = isolateScope.cells[0];
      var oldIndex = isolateScope.cells.indexOf(cell);
      isolateScope.insertCellAbove(cell);
      var newIndex = isolateScope.cells.indexOf(cell);
      // Expect length of cells array to be 2
      expect(isolateScope.cells.length).toBe(2);
      // Expect new index to be 1 more than old index
      expect(newIndex).toBe(oldIndex + 1);
    });

    it('should insert a cell below', function(){
      var cell = isolateScope.cells[0];
      var oldIndex = isolateScope.cells.indexOf(cell);
      isolateScope.insertCellBelow(cell);
      var newIndex = isolateScope.cells.indexOf(cell);
      // Expect length of cells to be 2
      expect(isolateScope.cells.length).toBe(2);
      // Expect new index and old index to be the same
      expect(newIndex).toBe(oldIndex);
    });
  });

});
