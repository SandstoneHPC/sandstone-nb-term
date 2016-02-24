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
        'nbterm.js',
        'terminal.controller.js',
        'notebook.controller.js'
    ),
}
