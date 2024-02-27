
.. map-header::


Racking configuration
=====================


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

Since sun position varies geographically, and so does the amount of sunlight
available at each sun position, the benefits of each racking configuration vary
geographically.  This chapter investigates the question: **how does location
affect the performance of various common racking configurations?**


Methodology
-----------

The effect of racking configuration is quantified through annual system
production simulated using a PVWatts v5-style model and 30-minute NSRDB PSM3
weather data.  The simulations assume a DC/AC ratio of 1.0 and a generic
c-Si PV module.

Three racking configurations are simulated:

1. Equator-facing fixed-tilt system, tilted at 20 degrees
2. Equator-facing fixed-tilt system, tilt equal to latitude
3. Single-axis tracking, with horizontal north-south axis and gcr of 0.4

Simulations are compared by calculating the ratio of their annual energy
to the annual energy simulated for a fixed horizontal system.

The pvlib-python modeling script used to simulate the results for each
location is available at GitHub: :script:`racking-configuration.py`.


Scenario 1: fixed tilt
----------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.0
   :colorscale_max: 1.4
   :short_description: Energy ratio [-]
   :layers_title: Array tilt:

    racking-configuration/FT_20_US_2020.tiff : 20 degrees
    racking-configuration/FT_lat_US_2020.tiff : Latitude



Scenario 2: single-axis tracking
--------------------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.0
   :colorscale_max: 1.4
   :short_description: Energy ratio [-]

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
