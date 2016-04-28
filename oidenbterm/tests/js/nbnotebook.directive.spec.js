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
    it('$cells should be defined and have length 1', function(){
      expect(isolateScope).toBeDefined();
      expect(isolateScope.cells.length).toBe(1);
    });
  });

});
