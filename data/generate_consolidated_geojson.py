import os
import gpxpy
import json

# Script reads a GPX file and generates a consolidated GeoJSON file for all trails
# This replaces the need for 60+ individual React components

# Script Parameters
gpx_filepath = os.path.join(os.path.dirname(__file__), "Trails.gpx")
geojson_output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "trails.json")

color_mapping = {
    "green": "#388E3C",
    "blue": "#2962FF",
    "red": "#D50000",
    "orange": "#FF9100",
    "yellow": "#FFEA00",
    "magenta": "magenta",
    "pink": "magenta",
    "black": "#212121",
    "grey": "#989898",
    "dark grey": "#696969",
    "light blue": "#0CE1F1",
    "purple": "#9400D3"
}

# Load cached trail distances
distance_cache_file_path = os.path.join(os.path.dirname(__file__), 'trail_distance_cache.json')
try:
    distance_cache = json.load(open(distance_cache_file_path, 'r'))
except (IOError, ValueError):
    print(f"Warning: Could not load distance cache from {distance_cache_file_path}")
    distance_cache = {}

# Load GPX File
gpx_file = open(gpx_filepath, "r", encoding='utf-8-sig')
print("Loading GPX file...")
gpx = gpxpy.parse(gpx_file)

# Create GeoJSON FeatureCollection
features = []

print("\n### PARSING TRAILS ###")
for track in gpx.tracks:
    base_name = track.name.split("(")[0]
    name, color = base_name.split("-")
    name = name.strip()
    color = color_mapping[color.strip().lower()]

    # Convert segment points to GeoJSON coordinates [lon, lat]
    coordinates = []
    for point in track.segments[0].points:
        coordinates.append([point.longitude, point.latitude])

    # Get trail metadata from cache
    trail_cache = distance_cache.get(name, {})
    distance = trail_cache.get("distance", "")
    elv_gain = trail_cache.get("elv_gain", "")
    elv_descent = trail_cache.get("elv_descent", "")

    # Determine if trail should be dashed
    line_dasharray = [3, 3] if "cross country" in name.lower() else None

    # Create GeoJSON Feature
    feature = {
        "type": "Feature",
        "properties": {
            "name": name,
            "color": color,
            "lineDasharray": line_dasharray,
            "distance": distance,
            "elevation_gain": elv_gain,
            "elevation_loss": elv_descent
        },
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates
        }
    }

    features.append(feature)
    print(f"Added trail: {name} - color: {color}, {len(coordinates)} points")

# Create GeoJSON FeatureCollection
geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Write to file
with open(geojson_output_path, "w") as outfile:
    json.dump(geojson, outfile, indent=2)
    print(f"\n✓ Wrote consolidated GeoJSON with {len(features)} trails to {geojson_output_path}")
