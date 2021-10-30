import os
import json
import gpxpy
import gpxpy.gpx
from os import path
from pathlib import Path
from calculate_length import get_trail_data

# Cached trail distance
distance_cache_file_name = 'trail_distance_cache.json'
distance_cache_file_path = os.path.join(os.path.dirname(__file__), distance_cache_file_name)

# Load GPX Trail File
p = Path(__file__).with_name('Trails.gpx')
gpx_file = p.open('r')
gpx_file.readline(3) # Remove invalid characters from file
gpx = gpxpy.parse(gpx_file)


trail_file_name = 'trail_mapping.json'
trail_file_path = path.join(path.dirname(__file__), trail_file_name)

coord_file_name = 'coordinate_mapping.json'
coord_file_path = path.join(path.dirname(__file__), coord_file_name)


def update_distance_cache(trail_name, distance_cache):
    distance_data = get_trail_data(trail_name)
        
    distance = distance_data.get("distance")
    elv_gain = distance_data.get("elevation_data").get("gain")
    elv_descent = distance_data.get("elevation_data").get("descent")
    
    distance_cache[trail_name] = {}
    if distance > 1000:
        distance_cache[trail_name]["distance"] = f"{round(distance/1000, 2)}km"
    else:
        distance_cache[trail_name]["distance"] = f"{int(round(distance, 0))}m"
    distance_cache[trail_name]["elv_gain"] = f"{int(round(elv_gain, 0))}m"
    distance_cache[trail_name]["elv_descent"] = f"{int(round(elv_descent, 0))}m"
    
    json.dump(distance_cache, open(distance_cache_file_path, 'w'))


def get_coordinate(point, lat_deminals, long_decimals):
    return f"{round(point.latitude, lat_deminals)},{round(point.longitude, long_decimals)}"


def generate_coordinate_mapping(distance_cache):
    gps_mapping = {}
    trail_mapping = {}
    trail_num = 0

    # Print just distances
    for track in gpx.tracks:
        trail_name = track.name.split('-')[0].strip()
        
        if trail_name not in distance_cache:
            update_distance_cache(trail_name, distance_cache)

        distance = distance_cache.get(trail_name).get("distance")
        elv_gain = distance_cache.get(trail_name).get("elv_gain")
        elv_descent = distance_cache.get(trail_name).get("elv_descent")

        trail_mapping[trail_num] = {
            "name": trail_name,
            "description": f"{distance}  -  {elv_gain}\u2191 {elv_descent}\u2193"
        }
       
        for point in track.segments[0].points:
            details = {
                "trail": trail_num,
                "lat": point.latitude,
                "lon": point.longitude
            }
            
            gps_mapping[get_coordinate(point, 3, 3)] = details
            gps_mapping[get_coordinate(point, 3, 4)] = details
            gps_mapping[get_coordinate(point, 4, 3)] = details
            gps_mapping[get_coordinate(point, 4, 4)] = details

        trail_num += 1        
       
    json.dump(trail_mapping, open(trail_file_path, 'w'))
    json.dump(gps_mapping, open(coord_file_path, 'w'))


if __name__ == '__main__':
  
    try:
        distance_cache = json.load(open(distance_cache_file_path, 'r'))
    except (IOError, ValueError):
        print(f"Elevation cache file could not be found at: {distance_cache_file_path}")
        distance_cache = {}
    
    generate_coordinate_mapping(distance_cache)