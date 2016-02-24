from terminado import SingleTermManager
from oidenbterm.handlers import AuthTermSocket


term_manager = SingleTermManager(shell_command=['bash'])

URL_SCHEMA = [
            (r"/nbterm/a/term", AuthTermSocket,
                    {'term_manager': term_manager})
        ]
