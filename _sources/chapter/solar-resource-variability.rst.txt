
.. map-header::


Solar resource variability
==========================

Introduction
------------

The sunlight available for collection by a PV system varies across several
timescales: hourly (due to clouds), daily (due to day and night), seasonally
(due to Earth's tilt and orbit around the sun), and annually (due to long-term change
in the composition of Earth's atmosphere).  The amount of sunlight reaching
the surface is called "solar resource".

Solar resource is represented by two primary quantities: global horizontal
irradiance (GHI) and direct normal irradiance (DNI).  GHI is the total sunlight
incident on a horizontal plane and represents the overall solar resource.
In contrast, DNI is measured on a plane that always faces in the sun and represents
only the portion of sunlight coming directly from the sun (not scattered in the
atmosphere).  DNI is more relevant for PV systems that track the sun, or concentrating
systems that cannot collect diffuse irradiance.

Different locations receive different amounts of solar resource.  For example,
due to differences in latitude and local climate, Albuquerque New Mexico
receives about twice as much solar resource as Seattle, Washington does.
Solar resource for a given location may also vary over time due to differences
in cloudiness and other climatic effects.
This chapter examines variation in solar resource, with the central
question: **how does solar resource vary, both geographically and over time?**


Methodology
-----------

**To-do**


Annual medians
--------------

The first set of maps shows how typical solar resource varies geographically.
This map displays the median annual resource in terms of GHI (or DNI using
the layer control in the corner of the map).

.. map-widget:: 
   :colorscale_name: YlOrRd
   :colorscale_min: 1
   :colorscale_max: 3
   :short_description: Annual insolation [MWh/m^2]
   :layers_title: Irradiance component

    resource-variability/psm3_median_annual_GHI_US.tiff : GHI
    resource-variability/psm3_median_annual_DNI_US.tiff : DNI


A regional trend is clear: typical annual GHI ranges from about 1 MWh/m^2 in the
Pacific Northwest, to roughly 1.5 MWh/m^2 on the East coast,
to over 2 MWh/m^2 in the Desert Southwest.  DNI shows a similar pattern, but with
greater variation across climates.


Annual variability
------------------

Now that we've quantified typical solar resource geographically,
let's examine how much it varies from year to year.  This map shows
the annual variability, relative to the long-term median, of annual insolation:

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 0.0
   :colorscale_max: 0.10
   :colorscale_label_digits: 2
   :short_description: Annual variation [-]
   :layers_title: Irradiance component

    resource-variability/psm3_variability_annual_GHI_US.tiff : GHI
    resource-variability/psm3_variability_annual_DNI_US.tiff : DNI

Here we see that GHI in much of the country varies (at one standard deviation)
by only ~1-4% annually.  However, two types of outlier are clear: high elevation
locations in the Rocky Mountains, and again the Pacific Northwest.  In these
locations, GHI can vary by over 10%.

Here again, DNI shows a similar but exaggerated pattern compared with GHI.


Long-term trend
---------------

Finally, let's examine whether the annual variation is truly random around
the long-term median or whether there is a long-term trend in solar resource.
This map displays the slope of a simple linear fit to annual insolation over
many years:

.. map-widget:: 
   :colorscale_name: RdBu
   :colorscale_min: -0.01
   :colorscale_max: 0.01
   :colorscale_label_digits: 2
   :short_description: Annual change [-]
   :layers_title: Irradiance component

    resource-variability/psm3_relative_change_GHI_US.tiff : GHI
    resource-variability/psm3_relative_change_DNI_US.tiff : DNI


**To-do:** discuss whether this is a real trend, or an artifact of the PSM3 dataset.


References
----------

.. bibliography::
   :list: enumerated
   :filter: False 

   Habte2020


Data files
----------

The geographic datasets shown on this page are available in the GeoTIFF
files listed below:

.. geotiff-index::
    :pattern: geotiffs/resource-variability/*.tiff
