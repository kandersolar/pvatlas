
.. map-header::


Racking configuration
=====================

.. warning::
    The results and discussion on this page are preliminary and subject to
    change.  This content should not be cited.

Introduction
------------

The amount of sunlight incident on a PV array's surface depends on the array
orientation.  Relative to a horizontal orientation, using advantageous
orientations can increase received insolation by up to 20% annually, depending
on the location.  The orientation of the array is determiend by the type of racking
the array is mounted on.

Racking falls into one of three main configurations:

1. **Fixed-tilt racking**

   `Description`: Fixed-tilt racking is a static configuration
   where the module orientation (tilt and azimuth angles)
   does not change.  Fixed-tilt structures are typically
   oriented towards the equator and have peak production at solar noon.

   `Key parameters`: tilt angle, azimuth angle

2. **Single-axis trackers**

   `Description`: Single-axis trackers (SATs) rotate the modules around an axis
   to follow the sun as it crosses the sky each day.  SATs typically align their
   rotation axis north-south so that the modules can be oriented east in the morning
   and west in the afternoon.  SATs tend to have a somewhat broader production
   profile than fixed-tilt arrays.

   `Key parameters`: ground coverage ratio, maximum rotation angle

3. **Dual-axis trackers**

   `Description`: Dual-axis trackers (DATs) rotate the modules around two axes
   and have the ability to face any position in the sky.  DATs tend to have an
   even broader production profile than SATs.  Compared to fixed-tilt and SATs,
   DATs are not very common in today's PV systems.

   `Key parameters`: N/A


Sun position varies geographically, and so does the amount of sunlight
available at each sun position.  This chapter investigates the question:
**how do various common racking configurations compare geographically?**


Methodology
-----------

The effect of racking configuration is quantified through annual system
production simulated using a PVWatts v5-style model and 30-minute NSRDB PSM3
weather data.  The simulations assume a DC/AC ratio of 1.0 and a generic
c-Si PV module.

The primary racking types are simulated in various configurations as follows:

1. Equator-facing fixed-tilt: 5 degree, 20 degree, and latitude tilts
2. Single-axis tracking: horizontal north-south axis, 60 degree max rotation,
   with backtracking enabled according to ground coverage ratios of 0.2, 0.3,
   0.4, and 0.5.  The trackers use the conventional astronomical-based pointing
   algorithm.
3. Dual-axis tracking: no rotation limits, always pointing directly at the sun.

All simulations are assumed to be shade-free.

Simulations are compared by calculating the ratio of their annual energy
to the annual energy simulated for a fixed horizontal system.

The pvlib-python modeling script used to simulate the results for each
location is available at GitHub: :script:`racking-configuration.py`.


Scenario 1: fixed tilt
----------------------


.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.0
   :colorscale_max: 1.3
   :colorscale_label_digits: 2
   :short_description: Energy ratio [-]
   :layers_title: Array tilt:

    racking-configuration/FT_lat_US_2020.tiff : Latitude
    racking-configuration/FT_20_US_2020.tiff : 20 degrees
    racking-configuration/FT_5_US_2020.tiff : 5 degrees



Scenario 2: single-axis tracking
--------------------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.0
   :colorscale_max: 1.5
   :colorscale_label_digits: 2
   :short_description: Energy ratio [-]

    racking-configuration/SAT_0_2_US_2020.tiff : SAT, GCR=0.2
    racking-configuration/SAT_0_3_US_2020.tiff : SAT, GCR=0.3
    racking-configuration/SAT_0_4_US_2020.tiff : SAT, GCR=0.4
    racking-configuration/SAT_0_5_US_2020.tiff : SAT, GCR=0.5


Scenario 3: dual-axis tracking
------------------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.0
   :colorscale_max: 1.8
   :short_description: Energy ratio [-]

    racking-configuration/DAT_US_2020.tiff : Dual-axis


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
