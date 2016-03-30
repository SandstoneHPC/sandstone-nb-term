# oide-nb-term
Web terminal app for the OIDE with a Jupyter/BASH notebook integration.

## Installing OIDE NBTerm using PIP

To install OIDE NBTerm using PIP, run:
```
pip install oide-nb-term
```

Now, add `oidenbterm` to the `INSTALLED_APPS` settings tuple in your `oide_settings.py` file.

The OIDE, which will now include the OIDE NBTerm app, can now be run with the following command:
```
oide
```
To use the OIDE with NBTerm, point your browser to `localhost:8888`.

## Installing OIDE NBTerm from source

The OIDE NBTerm app requires that you first install [The OIDE](https://github.com/ResearchComputing/OIDE)

Once the OIDE is installed, clone the OIDE NBTerm repository and enter the project directory:
```
git clone https://github.com/ResearchComputing/oide-nb-term.git
cd oide-nb-term
```
Then, build the dependencies for the front-end components:
```
cd oidenbterm
bower install
```

Switch back to the project root and install the python package (a virtualenv is recommended):
```
python setup.py install
```


Now, add `oidenbterm` to the `INSTALLED_APPS` settings tuple in your `oide_settings.py` file.

The OIDE, which will now include the OIDE NBTerm app, can now be run with the following command:
```
oide
```
To use the OIDE, point your browser to `localhost:8888`.
