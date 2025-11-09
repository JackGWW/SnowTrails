import math
import requests
import json
import gpxpy
import gpxpy.gpx
from os import path
from pathlib import Path
from geopy import distance


# Azure API Key - ADD HERE
subscription_key = ""

# Cached elevations location
file_name = 'elevation_cache.json'
file_path = path.join(path.dirname(__file__), file_name)


def load_batch_to_cache(coordinates):
    if subscription_key == "":
        raise Exception("subscription_key must be set to get elevations")

    points = ','.join(coordinates)
    
    url = f'http://dev.virtualearth.net/REST/v1/Elevation/List?points={points}&key={subscription_key}'

    response = requests.get(url)
    data = json.loads(response.text).get("resourceSets")[0].get("resources")[0].get("elevations")

    # Update cache with new data
    for index, elevation in enumerate(data):
        elevation_cache[coordinates[index]] = elevation

    print(f"Added {len(coordinates)} coordinate locations to the cache")


def load_cache(trail, batch_size=2):  
    coordinates = []
    total_count = 0
    all_points = trail.segments[0].points
    points_updated = False
    for point in all_points:
        coordinate = f"{point.latitude},{point.longitude}"
        total_count += 1

        if coordinate in elevation_cache:
            continue
        
        points_updated = True
        coordinates.append(coordinate)

        # Process each batch
        if len(coordinates) == batch_size:
            load_batch_to_cache(coordinates)
            coordinates = []        

    # Load any remaining coordinates
    if coordinates:
        load_batch_to_cache(coordinates)

    # Write updated cache to disk
    if points_updated:
        json.dump(elevation_cache, open(file_path, 'w'))
       

def get_elevation(coordinates):  
    point = f"{coordinates[0]},{coordinates[1]}"
    return elevation_cache.get(point)


def print_waypoints(gpx):
    for waypoint in gpx.waypoints:
        print('waypoint {0} -> ({1},{2})'.format(waypoint.name, waypoint.latitude, waypoint.longitude))


def get_track(gpx, name):
    for track in gpx.tracks:
        base_name = track.name.split('(')[0]
        if base_name.split('-')[0].strip() == name:
            return track


def get_distance_2d(trail):
    prev = None
    cur = None
    total_distance = 0
    
    for point in trail.segments[0].points:
        parsed_point = (point.latitude, point.longitude)
        prev = cur
        cur = parsed_point
        
        if prev:
            cur_distance = distance.distance(prev, cur).m
            total_distance += cur_distance

    return total_distance


def get_trail_data(trail_name):
    trail = get_track(gpx, trail_name)
    load_cache(trail)
    trail_data = {
        "distance": get_distance_3d(trail),
        "elevation_data": get_elevation_range(trail)
    }
    
    return trail_data


def get_distance_3d(trail):
    prev = None
    cur = None
    total_distance = 0
    
    for point in trail.segments[0].points:
        parsed_point = (point.latitude, point.longitude)
        prev = cur
        cur = parsed_point
        
        if prev:
            flat_distance = distance.distance(prev, cur).m
            cur_distance = math.sqrt(flat_distance**2 + (get_elevation(prev) - get_elevation(cur))**2)
            total_distance += cur_distance

    return total_distance


def get_elevation_range(trail):
    min_elevation = float('inf')
    max_elevation = float('-inf')
    gain = 0
    descent = 0
    
    prev = None
    cur = None
    for point in trail.segments[0].points:
        elevation = get_elevation((point.latitude, point.longitude))
        
        if elevation < min_elevation:
            min_elevation = elevation
        
        if elevation > max_elevation:
            max_elevation = elevation

        # Calculate changes
        prev = cur
        cur = elevation
        if prev:
            delta = cur - prev
            if delta > 0:
                gain += delta
            else:
                descent -= delta
    
    result = {
        "min": min_elevation,
        "max": max_elevation,
        "gain": gain,
        "descent": descent,
        "delta": gain - descent
    }

    return result


def print_distance_detailed(trailName):
    print(f"---{trailName}---")
    load_cache(get_track(gpx, trailName))
    trail = get_track(gpx, trailName)
    dist_2d = get_distance_2d(trail)
    dist_3d = get_distance_3d(trail)
    elevations = get_elevation_range(trail)

    print(f"Distance 2d: {round(dist_2d, 1)}m or {round(dist_2d/1000, 2)}km")
    print(f"Distance 3d: {round(dist_3d, 1)}m or {round(dist_3d/1000, 2)}km")
    print(f"Min:{round(elevations.get('min'), 1)}m, Max:{round(elevations.get('max'), 1)}m, Gain:{round(elevations.get('gain'), 1)}m, Descent:{round(elevations.get('descent'), 1)}m, Delta:{round(elevations.get('delta'), 1)}m")
    print()


def print_distance(trailName):
    load_cache(get_track(gpx, trailName))
    trail = get_track(gpx, trailName)
    dist_3d = get_distance_3d(trail)

    print(f"{trailName}: {round(dist_3d, 1)}m")


# Load GPX Trail File
p = Path(__file__).with_name('Trails.gpx')
gpx_file = p.open('r', encoding='utf-8-sig')  # utf-8-sig automatically handles BOM
gpx = gpxpy.parse(gpx_file)

# Load elevation cache
try:
    elevation_cache = json.load(open(file_path, 'r'))
except (IOError, ValueError):
    print(f"Elevation cache file could not be found at: {file_path}")
    elevation_cache = {}


if __name__ == '__main__':
    
    # Print just distances
    for track in gpx.tracks:
        base_name = track.name.split('(')[0]
        trail_name = base_name.split('-')[0].strip()
        print_distance(trail_name)

    print()
    print("################# DETAILED INFO #####################")
    for track in gpx.tracks:
        base_name = track.name.split('(')[0]
        trail_name = base_name.split('-')[0].strip()
        print_distance_detailed(trail_name)