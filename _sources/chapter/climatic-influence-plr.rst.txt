
.. map-header::


Climatic influence on PLR uncertainty
=====================================

Introduction
------------

PV systems experience gradual performance reduction over their lifetime due to component
aging and other effects.  Many technology- and climate-specific mechanisms
contribute to this performance loss, making it difficult to simulate and predict from
first principles.  Instead, it is common to extract empirical performance loss rates (PLR)
from performance measurements from fielded systems using statistical techniques.

Many statistical techniques for PLR estimation have been proposed.  What has
emerged as a de facto standard is the "year-on-year" (YOY) method as implemented
in `RdTools <https://github.com/NREL/rdtools>`_.  From a multi-year production
timeseries dataset, the YOY method extracts an estimated PLR and associated
confidence interval using a sequence of data filtering, normalization, aggregation,
and bootstrapping steps.  The accuracy and uncertainty of the PLR estimate
depend on the ability of these data processing steps to suppress the "noise"
introduced by effects like resource variability and identify the underlying
performance trend.  The longer the dataset being analyzed, and the more stable the
climate, the more certain the PLR estimate becomes.

Since these estimated PLRs affect the financing of new PV systems, understanding
the uncertainty of these estimates brings significant value.
This chapter examines the YOY method's performance across climates, with the central
question: **how many years of data are needed to achieve a given level of certainty,
and how does it vary across climates?**

Methodology
-----------

Synthetic PV performance datasets based on NSRDB PSM3 data and an assumed
PLR of -0.75 %/year were simulated for a grid of locations across the United
States.  The datasets vary in length from 2-10+ years, and are repeated in
each location to span the full history of the PSM3 dataset so that long-term
resource variability is captured.  The year-on-year method is then applied
to each dataset and the 95% confidence interval for the estimated PLR
is recorded.  This gives a set of confidence intervals for each location and
dataset length.  These confidence intervals are then examined to determine,
for each location, how many years of data are required to achieve a given
level of certainty in the PLR estimate.  This process can be repeated
for different simulation parameters (e.g. PV technology).

Using these idealized simulated datasets, we can produce a "best case"
estimate for PLR estimation uncertainty.  In real datasets, the true uncertainty
will be larger due to other sources of noise like system outages, sensor error,
and array soiling.

For full details on the simulation and analysis methodology,
see :cite:`Theristis2023srrl`.


Scenario 1: c-Si
----------------

First, we examine the results for a simulated system using crystalline silicon
(c-Si) PV modules.

This map visualizes the minimum dataset length (in years) for the PLR
confidence interval to have a 90% chance of being smaller than ±0.05 %/year
(results for other thresholds can be viewed using the layer control in
the corner of the map).

.. map-widget:: 
   :colorscale_min: 2
   :colorscale_max: 10
   :colorscale_name: Spectral
   :short_description: Data Length [years]
   :layers_title: PLR Uncertainty:

    synthetic-plr/can275_0.1_90.tiff : ±0.05 %/year
    synthetic-plr/can275_0.2_90.tiff : ±0.1 %/year


This map shows that fewer years of data are needed in the desert southwest
than elsewhere in the country to achieve a given uncertainty level.
However, relaxing the required certainty level reduces the required dataset
length, with almost everywhere in the U.S. requiring only two years of data
to achieve PLR estimates of ±0.1 %/year (under idealized conditions).


Scenario 2: CdTe
----------------

Do these results depend significantly on the technology being examined?
The following maps show the same analysis as above, but assuming First Solar
Cadmium Telluride (CdTe) PV modules instead of crystalline silicon.


.. map-widget:: 
   :colorscale_min: 2
   :colorscale_max: 10
   :colorscale_name: Spectral
   :short_description: Data Length [years]
   :layers_title: PLR Uncertainty:

    synthetic-plr/fslr_0.1_90.tiff : ±0.05 %/year
    synthetic-plr/fslr_0.2_90.tiff : ±0.1 %/year


The results in this case show broadly the same pattern as in the c-Si map,
although any given location might require one more or one fewer year of data.


References
----------

.. bibliography::
   :list: enumerated
   :filter: False 

   Theristis2023srrl
   Deceglie2023
   Jordan2022
   

Data files
----------

The geographic datasets shown on this page are available in the GeoTIFF
files listed below:

.. geotiff-index::
    :pattern: geotiffs/synthetic-plr/*.tiff

