import tornado.web
import oide.settings as global_settings
import oidenbterm.settings as app_settings
import jupyter_client

class KernelMixin(tornado.web.RequestHandler):
    def initialize(self):
        if not hasattr(self.application, 'kernel'):
            kernel_manager = jupyter_client.KernelManager()
            kernel_manager.start_kernel()
            self.application.kernel = kernel_manager.client()
            self.application.kernel.start_channels()
            self.kernel = self.application.kernel
        else:
            self.kernel = self.application.kernel
