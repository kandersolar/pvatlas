
.. map-header::


Climatic influence on PLR uncertainty
=====================================

Introduction
------------

PV systems experience gradual performance reduction over their lifetime due to component
aging and other effects.  Many technology- and climate-specific mechanisms
contribute to this performance loss, making it impractical to model from
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

This chapter examines the YOY method's performance across climates, with the central
question: **how many years of data are needed to achieve a given level of certainty,
and how does it vary across climates?**


Scenario 1: c-Si
----------------

First, at the 50th percentile:

.. map-widget:: 

    synthetic-plr/can275_0.075_50.tiff
    synthetic-plr/can275_0.1_50.tiff
    synthetic-plr/can275_0.15_50.tiff
    synthetic-plr/can275_0.2_50.tiff

And again at the 90th:

.. map-widget:: 

    synthetic-plr/can275_0.075_90.tiff
    synthetic-plr/can275_0.1_90.tiff
    synthetic-plr/can275_0.15_90.tiff
    synthetic-plr/can275_0.2_90.tiff


Scenario 2: CdTe
----------------

Do these results depend significantly on the technology being examined?
The following maps show the same analysis as above, but assuming First Solar
Cadmium Telluride (CdTe) PV modules instead of crystalline silicon.

First, at the 50th percentile:

.. map-widget:: 

    synthetic-plr/fslr_0.075_50.tiff
    synthetic-plr/fslr_0.1_50.tiff
    synthetic-plr/fslr_0.15_50.tiff
    synthetic-plr/fslr_0.2_50.tiff


And again at the 90th:

.. map-widget:: 

    synthetic-plr/fslr_0.075_90.tiff
    synthetic-plr/fslr_0.1_90.tiff
    synthetic-plr/fslr_0.15_90.tiff
    synthetic-plr/fslr_0.2_90.tiff



References
----------

.. bibliography::
   :list: enumerated

   Deceglie2023
   Jordan2022
   Theristis2023srrl
   

Data files
----------

.. geotiff-index::
    :pattern: geotiffs/synthetic-plr/*.tiff

