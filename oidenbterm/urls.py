from terminado import SingleTermManager
from oidenbterm.handlers import AuthTermSocket
from oidenbterm.handlers import KernelHandler
from oidenbterm.handlers import NotebookHandler


term_manager = SingleTermManager(shell_command=['bash'])

URL_SCHEMA = [
            (r"/nbterm/a/term", AuthTermSocket,
                    {'term_manager': term_manager}),
            (r"/nbterm/a/kernel/execute", KernelHandler,
                    {'kernel_name': 'bash'}),
            (r"/nbterm/a/notebook",NotebookHandler),
        ]
