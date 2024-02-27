
.. map-header::


Racking configuration
=====================

.. warning::
    This page is a placeholder while its content developed.


Introduction
------------

The amount of sunlight incident on a PV array's surface depends on the array
orientation.  Relative to a horizontal orientation, using advantageous
orientations can increase received insolation by up to 20% annually, depending
on the location.  The orientation of the array is determiend by the type of racking
the array is mounted on.

Two racking types see widespready use today: fixed-tilt racking and
single-axis trackers.  As the name implies, fixed-tilt racking is a static
configuration where the module orientation does not change.  In contrast,
single-axis trackers rotate the array around an axis to follow the sun
as it crosses the sky each day.  Fixed-tilt structures are typically
oriented towards the equator and have peak production at solar noon.
Single-axis trackers have a broader production profile due to being able
to face more towards the sun in the morning and evening.


Methodology
-----------

The effect of racking configuration is quantified through annual system
production simulated using a PVWatts v5-style model and 30-minute NSRDB PSM3
weather data.  The simulations assume a DC/AC ratio of 1.0 and a generic
c-Si PV module.  The single-axis tracking simulation has backtracking activated.

The pvlib-python modeling script used to simulate the results for each
location is available at GitHub: :script:`racking-configuration.py`.


Scenario 1: fixed tilt
----------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :short_description: Transposition Gain [%]
   :layers_title: Array tilt:

    racking-configuration/FT_20_US_2020.tiff : 20 degrees
    racking-configuration/FT_lat_US_2020.tiff : Latitude



Scenario 2: single-axis tracking
--------------------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :short_description: Transposition Gain [%]

    racking-configuration/SAT_0_4_US_2020.tiff : SAT



References
----------

.. .. bibliography::
..    :list: enumerated
..    :filter: False 

   


Data files
----------

The geographic datasets shown on this page are available in the GeoTIFF
files listed below:

.. geotiff-index::
    :pattern: geotiffs/racking-configuration/*.tiff
