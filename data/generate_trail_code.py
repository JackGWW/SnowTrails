import os
import glob
import shutil
import sys
import gpxpy
import json
from code_templates import *

# Script reads a GPX file with all the trail and marker data. From this data it generates all the required code for React-native-maps
# 1. Load GPX file
# 2. Parse data
# 3. Delete existing files
# 4. Create & write all JSON files
# 5. Create & write all code files

# REQUIRED DATA FORMATTING
# Markers - Use the correct symbol for the marker
#   The first marker will be used for the ref
#   The name must be the same as the trail - for multiple markers add a (#) to the end

# Trails - Set the name to be <Trail Name> - <Color>
#   It doesn't matter what color the trail is in basecamp


# Script Parameters
gpx_filepath = os.path.join("Trails.gpx")
json_output_dir = os.path.join("json")
code_output_dir = os.path.join("..", "src", "components", "trails")


# Utility functions
def stripped_name(name):
    stripped_name = ''.join(c for c in name if c.isalpha())
    return stripped_name


def delete_dir(dir_path):
    files = glob.glob(os.path.join(dir_path, '*'))
    for file_path in files:
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


def write_segment_to_json_file(segment, filename):
    # Creat object to write to json file
    output = []
    for point in segment.points:
        point = {
            'latitude': point.latitude,
            'longitude': point.longitude
        }
        output.append(point)

    # Create output txt file
    outPath = os.path.join(json_output_dir, filename + ".json")
    with open(outPath, "w") as outfile:
        json.dump(output, outfile, indent=4)
        print("Wrote json file to {}".format(outPath))


def generate_markers(data):
    print("Generating markers for " + data["name"])
    markers_code = []
    for num, marker in enumerate(data["markers"]):
        if num == 0:
            markers_code.append(linked_marker_template.substitute(
                latitude=marker["latitude"],
                longitude=marker["longitude"],
                name=data["name"],
                shape=marker["symbol"],
                id=str(marker["latitude"] + marker["longitude"]).split('.')[1][-6:]))
        else:
            markers_code.append(simple_marker_template.substitute(
                latitude=marker["latitude"],
                longitude=marker["longitude"],
                name=data["name"],
                shape=marker["symbol"],
                id=str(marker["latitude"] + marker["longitude"]).split('.')[1][-6:]))

    return ''.join(markers_code)


def generate_trail(data):
    print("Generating trail for " + data["name"])
    if data["markers"]:
        return linked_line_template.substitute(color=data["color"])
    else:
        return simple_line_template.substitute(color=data["color"])


def create_trail_code(data, filename):
    if data["markers"]:
        return trail_and_marker_template.substitute(
            markers=generate_markers(data),
            trail=generate_trail(data),
            filename=filename
        )
    else:
        return trail_template.substitute(
            trail=generate_trail(data),
            filename=filename
        )


def write_code_to_file(code, filename):
    outPath = os.path.join(code_output_dir, filename + ".js")
    with open(outPath, "w") as outfile:
        outfile.write(code)
        print("Wrote code file to {}".format(outPath))


# Load GPX File
gpx_file = open(gpx_filepath, "r")
print("Removing invalid characters from file: " + gpx_file.readline(3))
gpx = gpxpy.parse(gpx_file)


color_mapping = {
    "green": "#388E3C",
    "blue": "#2962FF",
    "red": "#D50000",
    "orange": "#FF9100",
    "yellow": "#FFEA00",
    "magenta": "magenta",
    "black": "#212121"
}


# Parse GPX File, adding all data to nested dictionaries
# Add trail data, using trail name as the key
print("\n### PARSING TRAILS ###")
trail_data = {}
for track in gpx.tracks:
    name, color = track.name.split("-")
    filename = stripped_name(name)
    color = color_mapping[color.strip().lower()]

    trail_data[filename] = {
        "name": name.strip(),
        "color": color,
        "segment": track.segments[0],
        "markers": []
    }
    print(f"Added trail {filename} ({name.strip()}) - color: {color}")

# Add marker data
print("\n### PARSING MARKERS ###")
for waypoint in gpx.waypoints:
    name = waypoint.name.split('(')[0]
    filename = stripped_name(name)
    symbol = waypoint.symbol.split(',')[0]

    if filename in trail_data:
        trail_data[filename]["markers"].append({
            "symbol": symbol,
            "latitude": waypoint.latitude,
            "longitude": waypoint.longitude
        })
        print(
            f"Added marker to {filename} ({waypoint.name}) - symbol: {symbol}")
    else:
        print("Trail not found for marker: {} ({})".format(name, waypoint.name))


# Delete contents of current directories
print("\nDeleting all files in json dir: " + json_output_dir)
delete_dir(os.path.join(json_output_dir))
print("Deleting all files in code dir: " + code_output_dir)
delete_dir(os.path.join(code_output_dir))


# Create new files
print("\nCreating new files")
all_imports = []
all_components = []
for filename, values in trail_data.items():
    write_segment_to_json_file(values["segment"], filename)

    code = create_trail_code(values, filename)
    write_code_to_file(code, filename)

    all_imports.append(
        all_trails_import_template.substitute(filename=filename))
    all_components.append(
        all_trails_component_template.substitute(filename=filename))


# Create AllTrails.js file
code = all_trails_template.substitute(
    imports=''.join(all_imports),
    components=''.join(all_components)
)
write_code_to_file(code, "AllTrails")
