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
import nbformat

class AuthTermSocket(TermSocket,BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self, *args, **kwargs):
        return super(AuthTermSocket, self).get(*args, **kwargs)

class KernelHandler(BaseHandler, KernelMixin):
    @oide.lib.decorators.authenticated
    def post(self):
        body = json.loads(self.request.body)
        operation = body["operation"]

        if operation == "START_KERNEL":
            self.start_kernel()
            self.write({'res': 'kernel_started'})
        if operation == "SHUTDOWN_KERNEL":
            self.shutdown_kernel()
            self.write({'res': 'kernel_stopped'});
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

class NotebookHandler(BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self, *args, **kwargs):
        # Given a filepath for a notebook, return formatted
        # cell contents.
        filepath = self.get_argument('filepath')
        cells = []

        with open(filepath, 'r') as nb_file:
            nb_cells = json.load(nb_file)['cells']

        for cell in nb_cells:
            tmp_cell = {}
            tmp_cell['type'] = cell.get('cell_type')
            tmp_cell['input'] = ''.join(cell.get('source', ''))
            try:
                if len(cell['outputs'][0]['text']) > 0:
                    tmp_cell['output'] = ''.join(cell['outputs'][0]['text'])
                    tmp_cell['hasExecuted'] = True
                    tmp_cell['showOutput'] = True
                else:
                    tmp_cell['output'] = ''
            except KeyError:
                pass
            if cell['cell_type'] == 'markdown':
                tmp_cell['editing'] = false
                tmp_cell['hasExecuted'] = True
            cells.append(tmp_cell)

        self.write({'cells':cells})

    @oide.lib.decorators.authenticated
    def post(self, *args, **kwargs):
        # Given a list of nb cells, save to ipynb format v4
        filepath = self.get_argument('filepath')
        filepath = '{}.ipynb'.format(filepath)
        cells = json.loads(self.request.body)['cells']

        nb_cells = []
        for cell in cells:
            cinput = cell.get('input', '')
            coutput = cell.get('output', '')
            ctype = cell.get('type')
            tmp_cell = {
                "cell_type": ctype,
                "metadata": {
                    "collapsed" : False, # whether the output of the cell is collapsed
                    "autoscroll": "auto", # any of true, false or "auto"
                },
                "source": cinput,
            }
            if ctype=='code':
                tmp_cell.update({
                    "execution_count": None,
                    "outputs": [{
                        "output_type" : "stream",
                        "name" : "stdout",
                        "text" : coutput,
                    }]
                })
            nb_cells.append(tmp_cell)

        base_nb = {
            'metadata': {
                'kernelspec': {
                    'name': 'bash',
                    "display_name": "Bash",
                    "language": "bash"
                },
                "language_info": {
                    "codemirror_mode": "shell",
                    "file_extension": ".sh",
                    "mimetype": "text/x-sh",
                    "name": "bash"
                }
            },
            'nbformat': 4,
            'nbformat_minor': 0,
            'cells': nb_cells
        }

        try:
            nbformat.validate(base_nb,version=4)
            nb = nbformat.from_dict(base_nb)
            nbformat.write(nb,filepath)
            self.write({'res':'File saved to {}'.format(filepath)})
        except nbformat.ValidationError:
            self.set_status(400)
            return
