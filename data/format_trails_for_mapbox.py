import gpxpy
import gpxpy.gpx
import os
from xml.etree.ElementTree import Element

# Script Parameters
gpx_filepath = os.path.join(os.path.dirname(__file__), "Trails.gpx")
formatted_gpx_filepath = os.path.join(os.path.dirname(__file__), "MapboxTrails.gpx")


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

# Store cross country trails differently
cross_country_trails = ["Cross Country Ski Trail"]


# Utility functions
def show_trail_name(name):
    if name.startswith("To "):
        return "false"
    else:
        return "true"

def get_trail_type(name):
    if name in cross_country_trails:
        return "cross_country"
    else:
        return "snowshoe"



# Load GPX File
gpx_file = open(gpx_filepath, "r")
print("Removing invalid characters from file: " + gpx_file.readline(3))
gpx = gpxpy.parse(gpx_file)


# Convert trail data into formatted data
formatted_gpx = gpxpy.gpx.GPX()
for track in gpx.tracks:
    name, color = track.name.split("-")
    name, color = name.strip(), color.strip()
    color_hex = color_mapping[color.lower()]

    # Create new formatted track
    formatted_track = gpxpy.gpx.GPXTrack()
    formatted_track.name = name
    formatted_track.segments.append(track.segments[0])

    color_extension = Element("color")
    color_extension.text = color
    formatted_track.extensions.append(color_extension)

    color_extension = Element("color_hex")
    color_extension.text = color_hex
    formatted_track.extensions.append(color_extension)

    color_extension = Element("show_name")
    color_extension.text = show_trail_name(name)
    formatted_track.extensions.append(color_extension)

    color_extension = Element("type")
    color_extension.text = get_trail_type(name)
    formatted_track.extensions.append(color_extension)

    # Save formatted track
    formatted_gpx.tracks.append(formatted_track)


# Convert marker data
for waypoint in gpx.waypoints:
    name = waypoint.name.split('(')[0]
    symbol = waypoint.symbol.split(',')[0].lower()

    # Create new waypoint
    formatted_waypoint = gpxpy.gpx.GPXWaypoint()
    formatted_waypoint.latitude = waypoint.latitude
    formatted_waypoint.longitude = waypoint.longitude
    formatted_waypoint.name = name
    formatted_waypoint.symbol = symbol
    
    # Save formatted waypoint
    formatted_gpx.waypoints.append(formatted_waypoint)


# Write formatted data
with open(formatted_gpx_filepath, "w") as outfile:
    outfile.write(formatted_gpx.to_xml())
    print("Wrote formatted GPX file to {}".format(formatted_gpx_filepath))