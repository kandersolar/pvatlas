import pvlib


def run_pvlib_model(df, lat, lon, mount):
    location = pvlib.location.Location(lat, lon)
    array = pvlib.pvsystem.Array(mount=mount,
                                 module_parameters={'pdc0': 1.0, 'gamma_pdc': -0.004},
                                 temperature_model_parameters=pvlib.temperature.TEMPERATURE_MODEL_PARAMETERS['sapm']['open_rack_glass_polymer'])
    
    system = pvlib.pvsystem.PVSystem(array, inverter_parameters={'pdc0': 1.0 / 0.95})
    mc = pvlib.modelchain.ModelChain.with_pvwatts(system, location, solar_position_method='ephemeris')
    mc.run_model(df)
    total_energy = mc.results.ac.sum() / 2
    return total_energy


def simulate_location(df, lat, lon):
    mounts = {
        'horizontal': pvlib.pvsystem.FixedMount(0, 180),
        'FT 20': pvlib.pvsystem.FixedMount(20, 180),
        'FT lat': pvlib.pvsystem.FixedMount(lat, 180),
        'SAT 0.4': pvlib.pvsystem.SingleAxisTrackerMount(max_angle=60, backtrack=True, gcr=0.4),
    }

    result = {}
    for label, mount in mounts.items():
        total_energy = run_pvlib_model(df, lat, lon, mount=mount)
        result[label] = total_energy

    return result

KEYS = ['ghi', 'dni', 'dhi', 'temp_air', 'wind_speed', 'albedo']
