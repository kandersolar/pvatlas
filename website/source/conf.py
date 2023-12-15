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

# %%

from docutils.parsers.rst import Directive, directives
from docutils import nodes

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

def setup(app):
    app.add_directive('map-widget', MapWidget)
    app.add_directive('map-header', MapHeader)
