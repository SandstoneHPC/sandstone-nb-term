import tornado.web
import oide.settings as global_settings
import oidenbterm.settings as app_settings
import jupyter_client

class KernelMixin(tornado.web.RequestHandler):
    def initialize(self, kernel_name='python2'):
        self.kernel_name = kernel_name
        if not hasattr(self.application, 'kernel'):
            self.start_kernel()
        else:
            self.kernel = self.application.kernel
            self.kernel_manager = self.application.kernel_manager

    def start_kernel(self):
        if not hasattr(self.application, 'kernel'):
            self.kernel_manager = jupyter_client.KernelManager()
            self.kernel_manager.kernel_name = self.kernel_name
            self.kernel_manager.start_kernel()
            self.application.kernel_manager = self.kernel_manager
            self.application.kernel = self.kernel_manager.client()
            self.application.kernel.start_channels()
            self.kernel = self.application.kernel
        else:
            self.kernel_manager.start_kernel()
            self.kernel.start_channels()

    def shutdown_kernel(self):
        # shutdown the kernel
        self.kernel_manager.shutdown_kernel()
        while self.kernel_manager.is_alive():
            pass
        # now we can be sure the kernel is shut down
