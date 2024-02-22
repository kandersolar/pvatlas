
Methodology
===========

PV Atlas takes a computational modeling approach to studying the effect of
climate on PV performance modeling and analysis.  By combining high-resolution
gridded weather datasets with detailed PV system performance models, we can
simulate realistic PV system production datasets corresponding to a wide
diversity of climates and system configurations.  These simulated production
datasets can then be examined to answer many questions about PV performance
and analysis.

Running simulations at such a scale requires three key components:
weather data spanning a diverse range of climates, customizable and scalable
PV modeling software, and sufficient computing resources to perform the simulations
and analyze the results.  The latter is provided by a high-performance computing (HPC)
cluster at `Sandia National Laboratories <https://hpc.sandia.gov/>`_.


Weather data
------------

Large-scale climatological studies are typically based on gridded
satellite-derived or reanalysis weather datasets.  Although generally
somewhat less accurate than measurements from ground stations, the high spatial
resolution and data availability of modern gridded datasets make them invaluable
in climate-based analysis studies.

Several large-scale climatological datasets are available, including
`MERRA-2 <https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/>`_ and
`ERA5 <https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels>`_.
These datasets have the advantage of global coverage and long data histories.
However, PV Atlas uses the `NSRDB PSM3 <https://nsrdb.nrel.gov/>`_ dataset due
to its high spatial resolution (approximately 4/2 km) and its focus on accuracy
for PV modeling applications.

.. NSRDB PSM3 v3.2.2

The high-resolution of the NSRDB gridded weather and irradiance data
requires a large amount of storage and computational capacity to process.
To give a sense of scale, efficient HDF5 files with one year of 30-minute data
covering the full spatial extent of the NSRDB are about `1.5 TB in size <https://data.openei.org/s3_viewer?bucket=nrel-pds-nsrdb&prefix=current%2F>`_.


Software
--------
At the center of PV Atlas is a PV system performance modeling engine using
`pvlib-python <https://pvlib-python.readthedocs.io>`_, an open-source PV modeling toolbox
written in and used via the Python programming language.  pvlib-python's
unparalleled flexibility and scalability makes large simulation-based studies
like PV Atlas possible.

The details of the PV performance models vary across analyses according to
the needs of each simulation.  For details, see the publications referenced in
each chapter.


Outputs
-------
The geographic data visualized in the interactive maps are available for public
download in the form of geo-referenced GeoTIFF files.  GeoTIFF is a standard
format for these kinds of rasterized geographic datasets.  Making the datasets
public allows users to import the analysis results into Python, GIS tools, or
other computing environments for further processing.

For details, see :ref:`data-access`.

References
----------

.. bibliography::
   :list: enumerated
   :filter: False 

   Sengupta2018
   Holmgren2018
   