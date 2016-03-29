import os

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'NBTerm',
        'link': '/#/nbterm',
        'description': 'Notebook Terminal'
    },
    'NG_MODULE_NAME': 'nbterm',
    'NG_MODULE_STYLESHEETS': (
        'nbterm.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'bower_components/marked/marked.min.js',
        'bower_components/angular-marked/dist/angular-marked.min.js',
        'nbterm.js',
        'notebook.service.js',
        'nbnotebook.directive.js',
        'terminal.controller.js',
        'notebook.controller.js'
    ),
}

try:
    local_settings_file = os.environ['OIDE_SETTINGS']
    if local_settings_file not in sys.path:
        sys.path.insert(0,os.path.dirname(local_settings_file))
    from oide_settings import *
    # __import__('oide_settings', globals(), locals(), ['*'])
except:
    pass
