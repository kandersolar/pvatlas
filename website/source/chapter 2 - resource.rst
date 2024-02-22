
.. map-header::


Solar resource variability
==========================

Introduction
------------

The sunlight available for collection by a PV system varies across several
timescales: hourly (due to clouds), daily (due to day and night), seasonally
(due to Earth's orbit and tilt), and annually (due to long-term change in
Earth's atmosphere).  The amount of sunlight available in a given location
is called "solar resource".

Different locations receive different amounts of solar resource.  For example,
sunny lower-latitude locations like Albuquerque receive about twice
as much solar resource as cloudy higher-latitude locations like Seattle do.

**To-do:** Describe GHI, DNI

This chapter examines geographic patterns in solar resource and how
solar resource varies over time.



Annual medians
--------------

Here are maps:

.. map-widget:: 
   :colorscale_name: YlOrRd
   :colorscale_min: 1
   :colorscale_max: 3

    resource-variability/psm3_median_annual_GHI_US.tiff : GHI
    resource-variability/psm3_median_annual_DNI_US.tiff : DNI



Annual variability
------------------

Here are maps:

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 0.0
   :colorscale_max: 0.25

    resource-variability/psm3_variability_annual_GHI_US.tiff : GHI
    resource-variability/psm3_variability_annual_DNI_US.tiff : DNI



Long-term change
----------------

Here are maps:

.. map-widget:: 
   :colorscale_name: RdBu
   :colorscale_min: -0.01
   :colorscale_max: 0.01
   :colorscale_label_digits: 2

    resource-variability/psm3_relative_change_GHI_US.tiff : GHI
    resource-variability/psm3_relative_change_DNI_US.tiff : DNI


References
----------

.. bibliography::
   :list: enumerated

   Habte2020


Data files
----------

.. geotiff-index::
    :pattern: geotiffs/resource-variability/*.tiff
