
.. map-header::


Antireflective coating
======================


Introduction
------------

The glass covers of PV modules reflects a portion of the incident sunlight
away, preventing it from reaching the PV cells and being converted to
electricity.  The fraction of light that is reflected depends on the angle
at which it strikes the module surface (the angle of incidence, AOI).
At larger angles of incidence, a larger fraction of the incident light is
reflected.

The nominal rating of a PV module is determined by illuminating it with light
at approximately normal incidence (AOI=0).  This means that the "loss" caused
by light reflection at normal incidence is included in the module's nominal
rating.  Therefore, only the *additional* portion of light that is reflected due to
non-normal incidence needs to be accounted for in energy models.  The extra
reflection loss from non-normal incidence is accounted for with the so-called
incidence angle modifier (IAM).

The precise shape of the IAM profile varies between modules depending on the
materials that light must travel through on the way to the PV cells, and the
texture of the surface of the PV cell itself.
To reduce reflection losses, some modules are manufactured with a special
antireflective coating on their surface.  This coating changes the shape
of the IAM profile to reduce losses at large angles of incidence.

The angles of incidence, and corresponding sunlight intensity, experienced
by a real system depends on its racking configuration and location.
This chapter investigates the question: **how does the performance improvement
from antireflective coatings vary with location and racking configuration?**


Methodology
-----------

The effect of an anti-reflective coating is quantified through annual system
production simulated using a PVWatts v5-style model and 30-minute NSRDB PSM3
weather data.  The incidence angle modifier (IAM) is calculated using
a physical model based on Snell's law and the Fresnel equations.  The coating
is simulated by including an additional layer in the IAM model at the specified
index of refraction.  IAM is applied only to the direct/beam component
of incident irradiance.

- **TODO**: ARC also increases the nameplate rating...

- **TODO**: diffuse IAM?

The simulations assume a DC/AC ratio of 1.0 and a generic
c-Si PV module.  The single-axis tracking simulations have backtracking activated.

Simulations are compared by calculating the ratio of their annual energy
to the annual energy simulated for the same system but with no antireflective coating.

The pvlib-python modeling script used to simulate the results for each
location is available at GitHub: :script:`antireflective-coating.py`.


Scenario 1: fixed tilt
----------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.00
   :colorscale_max: 1.01
   :colorscale_label_digits: 3
   :short_description: Energy ratio [-]
   :layers_title: ARC index of refraction:

    antireflective-coating/1_1__FT_20_US_2020.tiff : n_ar = 1.1
    antireflective-coating/1_2__FT_20_US_2020.tiff : n_ar = 1.2
    antireflective-coating/1_3__FT_20_US_2020.tiff : n_ar = 1.3
    antireflective-coating/1_4__FT_20_US_2020.tiff : n_ar = 1.4



Scenario 2: single-axis tracking
--------------------------------

.. map-widget:: 
   :colorscale_name: Viridis
   :colorscale_min: 1.00
   :colorscale_max: 1.01
   :colorscale_label_digits: 3
   :short_description: Energy ratio [-]
   :layers_title: ARC index of refraction:

    antireflective-coating/1_1__SAT_0_4_US_2020.tiff : n_ar = 1.1
    antireflective-coating/1_2__SAT_0_4_US_2020.tiff : n_ar = 1.2
    antireflective-coating/1_3__SAT_0_4_US_2020.tiff : n_ar = 1.3
    antireflective-coating/1_4__SAT_0_4_US_2020.tiff : n_ar = 1.4





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
    :pattern: geotiffs/antireflective-coating/*.tiff
