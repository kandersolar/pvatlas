# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "PV Atlas"
copyright = '2023'
author = 'PVPMC'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinxcontrib.bibtex',
]

templates_path = ['_templates']
exclude_patterns = []

nbsphinx_execute = 'never'
nbsphinx_requirejs_path = ''  # disable requirejs; already loaded by theme

# https://sphinxcontrib-bibtex.readthedocs.io/en/latest/usage.html#configuration
bibtex_default_style = 'plain'
bibtex_reference_style = 'label'
bibtex_bibfiles = ['references.bib']

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_book_theme'
html_static_path = ['_static']
html_title = "PV Atlas"

html_theme_options = {
    # "repository_url": "https://github.com/AssessingSolar/unofficial-psm3-userguide",
    "use_repository_button": False,
}

html_extra_path = ['../../data']

# %%

from docutils.parsers.rst import Directive, directives
from docutils import nodes

import glob
import os
import rioxarray
import pandas as pd


with open("_static/map-header.html", "r") as f:
    MAP_HTML_HEADER = f.read()

with open("_static/map-widget-template.html", "r") as f:
    MAP_HTML_TEMPLATE = f.read()


class MapHeader(Directive):

    required_arguments = 0
    optional_arguments = 0
    has_content = False
    option_spec = {}

    def run(self):
        node = nodes.raw('', MAP_HTML_HEADER, format='html')
        return [node]


class MapWidget(Directive):

    required_arguments = 0
    optional_arguments = 0
    has_content = True
    option_spec = {'id': directives.unchanged_required}

    def run(self):
        filenames = filter(lambda s: s != '', self.content)

        geotiffs_text = ", ".join(f'"{fn}"' for fn in filenames)
        # TODO: use jinja instead of this hacky templating
        html = (MAP_HTML_TEMPLATE
            .replace("##GEOTIFFS##", geotiffs_text)
            .replace("##ID##", self.options['id'])
        )
        
        node = nodes.raw('', html, format='html')
        return [node]


def _filesize_format(n_bytes):
    n = n_bytes
    for unit in ['B', 'KiB', 'MiB']:
        if n < 1024:
            return f"{n:0.01f} {unit}"
        n /= 1024
    return f"{n:0.01f} GiB"


class GeotiffIndex(Directive):
    required_arguments = 0
    optional_arguments = 0
    has_content = False
    option_spec = {}

    def run(self):
        DATA_DIR = os.path.abspath('../data')
        print(f"pv atlas: looking for GeoTIFF files in {DATA_DIR}")
        filenames = glob.glob('**/*.tiff', root_dir=DATA_DIR, recursive=True)
        print(f"pv atlas: found {len(filenames)} GeoTIFF files")
        
        records = []
        for filename in filenames:
            rds = rioxarray.open_rasterio(os.path.join(DATA_DIR, filename))
            records.append({
                'description': rds.attrs.get('DESCRIPTION', '-'),
                'date': rds.attrs.get('CREATION_DATE', '-'),
                'displayname': os.path.split(filename)[-1],
                'url': filename.replace('\\', '/'),
                'filesize': _filesize_format(os.path.getsize(os.path.join(DATA_DIR, filename))),
            })
        print("pv atlas: parsed GeoTIFF metadata:")
        print(pd.DataFrame(records))
        
        table = nodes.table(cols=3)
        group = nodes.tgroup()
        head = nodes.thead()
        body = nodes.tbody()
        
        table += group
        group += nodes.colspec(colwidth=4)
        group += nodes.colspec(colwidth=2)
        group += nodes.colspec(colwidth=3)
        group += nodes.colspec(colwidth=8)
        group += head
        group += body
        
        row = nodes.row()
        row += nodes.entry('', nodes.paragraph('', nodes.Text('GeoTIFF file')))
        row += nodes.entry('', nodes.paragraph('', nodes.Text('File size')))
        row += nodes.entry('', nodes.paragraph('', nodes.Text('Creation date')))
        row += nodes.entry('', nodes.paragraph('', nodes.Text('Description')))
        head += row
        
        for record in records:
            row = nodes.row()            
            
            filenode = nodes.paragraph()
            linknode = nodes.reference('', '', internal=False, refuri=record['url'])
            linknode.append(nodes.Text(record['displayname']))
            filenode += linknode
            
            row += nodes.entry('', filenode)
            row += nodes.entry('', nodes.paragraph('', nodes.Text(record['filesize'])))
            row += nodes.entry('', nodes.paragraph('', nodes.Text(record['date'])))
            row += nodes.entry('', nodes.paragraph('', nodes.Text(record['description'])))
            body += row

        return [table]


def setup(app):
    app.add_directive('map-widget', MapWidget)
    app.add_directive('map-header', MapHeader)
    app.add_directive('geotiff-index', GeotiffIndex)
