import oide.lib.decorators
import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings
from oide.lib.handlers.base import BaseHandler
from terminado import TermSocket



class AuthTermSocket(TermSocket,BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self, *args, **kwargs):
        return super(AuthTermSocket, self).get(*args, **kwargs)
