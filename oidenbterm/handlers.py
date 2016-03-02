import oide.lib.decorators
import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings
from oide.lib.handlers.base import BaseHandler
from oidenbterm.mixins.kernel_mixin import KernelMixin
from terminado import TermSocket
from traitlets import Integer
import json
import tornado.web
import jupyter_client

class AuthTermSocket(TermSocket,BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self, *args, **kwargs):
        return super(AuthTermSocket, self).get(*args, **kwargs)

class KernelHandler(BaseHandler, KernelMixin):
    @oide.lib.decorators.authenticated
    def post(self):
        body = json.loads(self.request.body)
        operation = body["operation"]

        if operation == "SHUTDOWN_KERNEL":
            # shutdown the kernel
            self.kernel_manager.shutdown_kernel()
            while self.kernel_manager.is_alive():
                pass
            # now we can be sure the kernel is shut down
            self.write({'res': []});
        elif operation == "EXECUTE_CODE":
            code = json.loads(self.request.body)["code"]
            msg_id = self.kernel.execute(code)
            # print(msg_id)
            res = []
            while True:
                # print('stuck here')
                try:
                    msg = self.kernel.shell_channel.get_msg(Integer(10, config=True))
                    # print(msg)
                except Empty:
                    # print('Empty')
                    pass
                    # This indicates that something bad happened, as AFAIK this should return...
                    # self.log.error("Timeout waiting for execute reply")
                    # raise KnitpyException("Timeout waiting for execute reply.")
                if msg['parent_header'].get('msg_id') == msg_id:
                    # It's finished, and we got our reply, so next look at the results
                    break
                else:
                    # print('something')
                    # not our reply
                    # self.log.debug("Discarding message from a different client: %s" % msg)
                    continue


            # Now look at the results of our code execution and earlier completion requests
            # We handle messages until the kernel indicates it's ide again
            status_idle_again = False
            while True:
                # print('stuck here now')
                try:
                    msg = self.kernel.get_iopub_msg(Integer(10, config=True))
                    # print('doing something')
                except Exception:
                    # print('Empty')
                    pass
                    # There should be at least some messages: we just executed code!
                    # The only valid time could be when the timeout happened too early (aka long
                    # running code in the document) -> we handle that below
                    # self.log.warn("Timeout waiting for expected IOPub output")
                    break

                # print(msg['parent_header'].get('msg_id') != msg_id)
                if msg['parent_header'].get('msg_id') != msg_id:
                    if msg['parent_header'].get(u'msg_type') != u'is_complete_request':
                        # print('output')
                        pass
                        # not an output from our execution and not one of the complete_requests
                        # self.log.debug("Discarding output from a different client: %s" % msg)
                    else:
                        # print('something too')
                        pass
                        # complete_requests are ok
                    continue

                # Here we have some message which corresponds to our code execution
                msg_type = msg['msg_type']
                content = msg['content']

                # print('Out')

                # The kernel indicates some status: executing -> idle
                if msg_type == 'status':
                    if content['execution_state'] == 'idle':
                        # When idle, the kernel has executed all input
                        status_idle_again = True
                        break
                    else:
                        # the "starting execution" messages
                        continue
                elif msg_type == 'clear_output':
                    # we don't handle that!?
                    # self.log.debug("Discarding unexpected 'clear_output' message: %s" % msg)
                    continue
                ## So, from here on we have a messages with real content
                # self.write(content)
                res.append(content)

            if not status_idle_again:
                pass
                # self.log.error("Code lines didn't execute in time. Don't use long-running code in "
                            #    "documents or increase the timeout!")
                # self.log.error("line(s): %s" % lines)
            self.write({'res': res})
