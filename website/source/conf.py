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

# https://sphinxcontrib-bibtex.readthedocs.io/en/latest/usage.html#configuration
bibtex_default_style = 'plain'
bibtex_reference_style = 'label'
bibtex_bibfiles = ['references.bib']

bibtex_cite_id = "cite-{bibliography_count}-{key}"
bibtex_footcite_id = "footcite-{key}"
bibtex_bibliography_id = "bibliography-{bibliography_count}"
bibtex_footbibliography_id = "footbibliography-{footbibliography_count}"


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
import json
import rioxarray
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


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
    option_spec = {
        'colorscale_min' : float,
        'colorscale_max': float,
        'colorscale_name': str,
        'colorscale_label_digits': int,
        'short_description': str,
        'layers_title': str,
    }

    def _parse_layer_specs(self, raw_specs):
        specs = []
        for raw_spec in raw_specs:
            if ":" in raw_spec:
                filename, label = raw_spec.split(":", 1)
            else:
                # if no label supplied, fall back to just using the filename
                filename = label = raw_spec

            label = label.strip()
            filename = filename.strip()
            specs.append({
                'label': label,
                'filename': filename,
            })
        return specs


    def run(self):
        
        raw_specs = filter(lambda s: s != '', self.content)
        specs = self._parse_layer_specs(raw_specs)
        
        uuid = self.state.document.settings.env.new_serialno('map-widget')
        # TODO: use jinja instead of this hacky templating
        options = {
            'id': str(uuid),
            'geotiffSpecs': specs,
        }
        defaults = {
            'colorscale_min': '',
            'colorscale_max': '',
            'colorscale_name': '',
            'colorscale_label_digits': 1,
            'short_description': 'Value',
            'layers_title': '',
        }
        for key, value in defaults.items():
            options[key] = self.options.get(key, value)
        
        html = (
            MAP_HTML_TEMPLATE
            .replace("##OPTIONS##", json.dumps(options))
            .replace("##ID##", options['id'])
        )
        node = nodes.raw('', html, format='html')
        return [node]


def _filesize_format(n_bytes):
    n = n_bytes
    for unit in ['B', 'KiB', 'MiB']:
        if n < 1024:
            break
        n /= 1024
    else:
        unit = 'GiB'
    return f"{n:0.01f} {unit}"


class GeotiffIndex(Directive):
    required_arguments = 0
    optional_arguments = 0
    has_content = False
    option_spec = {'pattern': directives.unchanged}

    def run(self):
        env = self.state.document.settings.env
    
        images_directory = os.path.normpath("./source/_static/thumbnails")
        print(f"pv atlas: creating thumbnail directory ({images_directory})")
        os.makedirs(images_directory, exist_ok=True)
        
        DATA_DIR = os.path.abspath('../data')
        pattern = self.options.get('pattern', '**/*.tiff')
        print(f"pv atlas: looking for GeoTIFF files in {DATA_DIR} using pattern: {pattern}")
        filenames = sorted(glob.glob(pattern, root_dir=DATA_DIR, recursive=True))
        print(f"pv atlas: found {len(filenames)} GeoTIFF files")
        
        records = []
        for filename in filenames:
            print(f"pv atlas: processing {filename}")
            rds = rioxarray.open_rasterio(os.path.join(DATA_DIR, filename))
            rds = rds.sel(band=1)  # select first (only) layer of data
            rds = rds.where(rds != rds.attrs['_FillValue'], np.nan)

            image_filepath = os.path.join(images_directory, filename.replace('.tiff', '.png'))
            env.images.add_file('', image_filepath)

            if not os.path.exists(image_filepath):
                os.makedirs(os.path.dirname(image_filepath), exist_ok=True)

                rds.plot(add_colorbar=False, size=3, aspect=1.5)
                plt.axis('off')
                plt.title(None)
                plt.savefig(image_filepath, bbox_inches='tight', dpi=100)
                plt.close('all')
                print(f"pv atlas: saved thumbnail to {image_filepath}")

            records.append({
                'description': rds.attrs.get('DESCRIPTION', '-'),
                'date': rds.attrs.get('CREATION_DATE', '-'),
                'displayname': os.path.split(filename)[-1],
                'url': "/" + filename.replace(os.sep, '/'),  # location within the data directory
                'filesize': _filesize_format(os.path.getsize(os.path.join(DATA_DIR, filename))),
                'thumbnail': "/" + image_filepath.replace("source" + os.sep, ""),
            })

            
        print("pv atlas: parsed GeoTIFF metadata:")
        print(pd.DataFrame(records))
        
        table = nodes.table(cols=3)
        group = nodes.tgroup()
        head = nodes.thead()
        body = nodes.tbody()
        
        table += group
        group += nodes.colspec(colwidth=3)
        group += nodes.colspec(colwidth=8)
        group += head
        group += body
        
        row = nodes.row()
        row += nodes.entry('', nodes.paragraph('', nodes.Text('GeoTIFF file')))
        row += nodes.entry('', nodes.paragraph('', nodes.Text('Description')))
        head += row
        
        for record in records:
            row = nodes.row()            
            
            thumbnailnode = nodes.paragraph()
            linknode = nodes.reference('', '', internal=False, refuri=record['url'])
            linknode.append(nodes.image("", uri=record['thumbnail'], alt=record['thumbnail']))
            thumbnailnode += linknode
            row += nodes.entry('', thumbnailnode)
            
            description = nodes.paragraph('', nodes.Text("Description: " + record['description']))
            downloadinfo = nodes.paragraph()
            linknode = nodes.reference('', '', internal=False, refuri=record['url'])
            linknode.append(nodes.raw("", '<i class="fa fa-download" aria-hidden="true"></i>&nbsp;', format="html"))
            linknode.append(nodes.Text(record['displayname'] + " - [" + record['filesize'] + "]"))
            downloadinfo += linknode
            description.append(downloadinfo)
            row += nodes.entry('', description)
            
            body += row

        return [table]


def setup(app):
    app.add_directive('map-widget', MapWidget)
    app.add_directive('map-header', MapHeader)
    app.add_directive('geotiff-index', GeotiffIndex)
