import pvlib


def run_pvlib_model(df, lat, lon, n_ar, mount):
    location = pvlib.location.Location(lat, lon)
    array = pvlib.pvsystem.Array(mount=mount,
                                 module_parameters={'pdc0': 1.0, 'gamma_pdc': -0.004, 'n_ar': n_ar},
                                 temperature_model_parameters=pvlib.temperature.TEMPERATURE_MODEL_PARAMETERS['sapm']['open_rack_glass_polymer'])
    
    system = pvlib.pvsystem.PVSystem(array, inverter_parameters={'pdc0': 1.0 / 0.95})
    mc = pvlib.modelchain.ModelChain.with_pvwatts(system, location, solar_position_method='ephemeris')
    mc.run_model(df)
    total_energy = mc.results.ac.sum() / 2
    return total_energy


def simulate_location(df, lat, lon):
    mounts = {
        'FT_20': pvlib.pvsystem.FixedMount(20, 180),
        'SAT_0.4': pvlib.pvsystem.SingleAxisTrackerMount(max_angle=60, backtrack=True, gcr=0.4),
    }

    result = {}
    for mount_label, mount in mounts.items():
        total_energy_baseline = run_pvlib_model(df, lat, lon, n_ar=None, mount=mount)
        for n_ar in [1.1, 1.2, 1.3, 1.4]:
            total_energy = run_pvlib_model(df, lat, lon, n_ar=n_ar, mount=mount)
            result[f'n_ar={n_ar}__{mount_label}'] = total_energy / total_energy_baseline
    
    return result

KEYS = ['ghi', 'dni', 'dhi', 'temp_air', 'wind_speed']
