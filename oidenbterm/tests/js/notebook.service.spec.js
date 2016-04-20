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

    httpBackend.whenPOST('/nbterm/a/kernel/execute').respond(function(){
      return [200, {'result': 'kernel_status changed'}];
    });

  }));

  describe('NotebookService tests', function(){
    it('should should initialize properly', function(){
      expect(nbService.cellsObj).toBeDefined();
      expect(nbService.getKernelStatus()).toBe('idle');
    });
    it('should start the kernel and set the kernel status to idle', function(){
      nbService.startKernel();
      httpBackend.flush();
      expect(nbService.getKernelStatus()).toBe('idle');
    });
    it('should stop the kernel and set the kernel status to stopped', function(){
      nbService.stopKernel();
      httpBackend.flush();
      expect(nbService.getKernelStatus()).toBe('stopped');
    });
  });

});
