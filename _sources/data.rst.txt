
Data Access
===========

PV Atlas modeling results are made publicly available in the form
of `GeoTIFF <https://en.wikipedia.org/wiki/GeoTIFF>`_ raster files.
A complete list of files and their descriptions is found below.

These files are georeferenced and can be imported into GIS
and other geospatial analysis software.  Here is an example
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
    
    rds.sel(x=-80, y=40, method='nearest')  # extract the value for a location


Here is a complete list of PV Atlas GeoTIFF files:

.. geotiff-index::

