
.. _data-access:

Data Access
===========

PV Atlas modeling results are made publicly available in the form
of `GeoTIFF <https://en.wikipedia.org/wiki/GeoTIFF>`_ raster files.
These files are georeferenced and can be imported into GIS
and other geospatial analysis software for further analysis.

In addition to the standard GeoTIFF metadata, PV Atlas files also contain
the following tags:

* ``CREATION_DATE``: Date the GeoTIFF file was created.
* ``DESCRIPTION``: A sentence describing the data file contents.
* ``PROJECT``: Origin of the data file.  Currently always set to "PVPMC: PV Atlas".

Here is an example
of importing a results file into a Python ``xarray`` dataset
using the `rioxarray <https://corteva.github.io/rioxarray>`_ package:


.. code-block:: python

    import rioxarray
    import numpy as np
    
    filename = "path/to/geotiff_file.tiff"
    rds = rioxarray.open_rasterio(filename)
    rds = rds.sel(band=1)  # select first (only) layer of data
    rds = rds.where(rds != rds.attrs['_FillValue'], np.nan)
    
    print(rds.attrs)  # show dataset description, creation date, etc
    
    rds.plot()  # visualize the raster data
    
    rds.sel(x=-80, y=40, method='nearest').item()  # extract the value for lat=40, lon=-80


GeoTIFF File Index
------------------

Here is a complete list of PV Atlas GeoTIFF files:

.. geotiff-index::

