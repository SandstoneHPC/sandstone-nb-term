from terminado import SingleTermManager
from sandstone_nbterm.handlers import AuthTermSocket
from sandstone_nbterm.handlers import KernelHandler
from sandstone_nbterm.handlers import NotebookHandler


term_manager = SingleTermManager(shell_command=['bash'])

URL_SCHEMA = [
            (r"/nbterm/a/term", AuthTermSocket,
                    {'term_manager': term_manager}),
            (r"/nbterm/a/kernel/execute", KernelHandler,
                    {'kernel_name': 'bash'}),
            (r"/nbterm/a/notebook",NotebookHandler),
        ]
