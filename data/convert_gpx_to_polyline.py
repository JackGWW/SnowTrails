"""
Output Lat and Long from GPX to a json file in the format used for Polylines in react-native-maps
Requires gpxpy
This script expects your input GPX to be located in a subdir named 'gpx'

Command line args:
1 (required): file name, without file expension
2 (optional): color to set polyline to
"""

import os
import gpxpy
import gpxpy.gpx
import csv
import sys
import json

outputdir = "json"
os.path.exists(outputdir) or os.makedirs(outputdir)

# put your GPX file in a subdir named 'gpx'
fileName = sys.argv[1]
try:
    gpx_file = open(os.path.join("gpx", fileName + ".gpx"), "r")
    gpx = gpxpy.parse(gpx_file)
except IOError:
    print("Couldn't open the input GPX file name " +
          fileName + ". Ensure it's in the 'gpx' dir.")
    exit(-1)

# Creat object to write to json file
output = []
for track in gpx.tracks:
    for segment in track.segments:
        for point in segment.points:
            point = {
                'latitude': point.latitude,
                'longitude': point.longitude
            }
            output.append(point)
            
# Create output txt file
outPath = os.path.join(outputdir, fileName + ".json")
with open(outPath, "w") as outfile:
    json.dump(output, outfile, indent=4)

print("Output file converted successfully.")
print("Find file at: " + outPath)