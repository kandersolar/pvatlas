import rasterio  # tested with v1.3.9
from rasterio.transform import Affine
import numpy as np
import datetime


def write_geotiff(data, filename, description, metadata=None, nodata=np.float32(-9999)):
    """
    Write data from a gridded pandas DataFrame to a GeoTIFF file.
    
    Parameters
    ----------
    data : pandas.DataFrame
        Data to write to the file.  It must be in "pivoted" form with
        latitude as the index and longitude as the columns.
    filename : str
        File path for the new GeoTIFF file
    description : str
        Dataset description to embed in the GeoTIFF file.
    metadata : dict, optional
        Key-value pairs to write as tags to the GeoTIFF file.
        If not specified, PV Atlas defaults are used.
    nodata : numeric, default: np.float32(-9999)
        Filler value to use to indicate missing data.

    Returns
    -------
    None
    """
    x = data.columns
    y = data.index
    xres = x[1] - x[0]
    yres = y[1] - y[0]
    transform = Affine.translation(x[0] - xres / 2, y[-1] - yres / 2) * Affine.scale(xres, -yres)
    data = np.flipud(data.fillna(nodata).values.astype(np.float32))
    
    if metadata is None:
        metadata = {
            'PROJECT': 'PVPMC: PV Atlas',
            'CREATION_DATE': datetime.date.today().strftime("%Y-%m-%d"),
        }

    
    with rasterio.open(
        filename,
        'w',
        driver='GTiff',
        height=data.shape[0],
        width=data.shape[1],
        count=1,
        dtype=data.dtype,
        crs='+proj=latlong',
        transform=transform,
        nodata=nodata
    ) as dst:
        dst.write(data, 1)
        dst.update_tags(DESCRIPTION=description, **metadata)

