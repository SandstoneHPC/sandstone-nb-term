describe('nbNotebook directive', function(){
  var compile;
  var scope;
  var element;
  var httpBackend;
  var isolateScope;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.editor'));
  beforeEach(module('sandstone.templates'));
  beforeEach(module('sandstone.nbterm'));
  beforeEach(module('sandstone.filesystemservice'));
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
      // Expect cells to be defined
      expect(isolateScope).toBeDefined();
      // Expect cells array length to be 1
      expect(isolateScope.cells.length).toBe(1);
      // Expect the kernel name to bash
      expect(isolateScope.kernelName).toBe("bash");
      // Expect runQueue to be defined
      expect(isolateScope.runQueue).toBeDefined();
      expect(isolateScope.runQueue.length).toBe(0);
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

    it('should delete a cell when there is only one cell', function(){
      var cell = isolateScope.cells[0];
      isolateScope.deleteCell(cell);
      expect(isolateScope.cells.length).toBe(0);
    });

    it('should delete a cell when there is more than one cell, and inserted below', function(){
      var cell = isolateScope.cells[0];
      isolateScope.insertCellBelow(cell);
      isolateScope.deleteCell(cell);
      // Cell count should be 1
      expect(isolateScope.cells.length).toBe(1);
      // The cell should not be present in cells array
      expect(isolateScope.cells.indexOf(cell)).toBe(-1);
    });

    it('should delete a cell when there is more than one cell, and inserted above', function(){
      var cell = isolateScope.cells[0];
      isolateScope.insertCellAbove(cell);
      isolateScope.deleteCell(cell);
      // Cell count should be 1
      expect(isolateScope.cells.length).toBe(1);
      // The cell should not be present in cells array
      expect(isolateScope.cells.indexOf(cell)).toBe(-1);
    });

    it('should be able to run a cell', function(){
      var cell = isolateScope.cells[0];
      isolateScope.runCell(cell);
      // expect statements
      expect(cell.hasExecuted).not.toBeTruthy();
      expect(cell.running).toBeTruthy();
      expect(cell.showOutput).toBeTruthy();
      expect(isolateScope.runQueue.length).toBe(1);
    });
    it('should be able to run all the cells above', function(){
      var cell = isolateScope.cells[0];
      isolateScope.insertCellBelow(cell);
      isolateScope.insertCellBelow(cell);
      isolateScope.insertCellAbove(cell);
      isolateScope.insertCellAbove(cell);
      isolateScope.runAllCellsAbove(isolateScope.cells[4]);
      // Expect runqueue to have 4 cells
      expect(isolateScope.runQueue.length).toBe(4);
    });
    it('should create a new cell when the length of cells array becomes zero', function(){
      var cell = isolateScope.cells[0];
      isolateScope.deleteCell(cell);
      expect(isolateScope.cells.length).toBe(0);
      isolateScope.$digest();
      // It should create a new cell
      expect(isolateScope.cells.length).toBe(1);
    });
  });

});
