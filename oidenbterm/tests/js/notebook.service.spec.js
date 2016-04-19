describe('NotebookService', function(){
  var nbService;
  var httpBackend;

  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));
  beforeEach(module('oide.filesystemservice'));
  beforeEach(module('oide.templates'));
  beforeEach(module('oide.filetreedirective'));

  beforeEach(inject(function(NotebookService, $httpBackend){
    nbService = NotebookService;
    httpBackend = $httpBackend;
  }));

  describe('NotebookService tests', function(){
    it('should should initialize properly', function(){
      expect(nbService.cellsObj).toBeDefined();
      expect(nbService.getKernelStatus()).toBe('idle');
    });
  });

});
