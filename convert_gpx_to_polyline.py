"""
Output Lat and Long from GPX to a txt file in the format used for Polylines in react-native-maps
Requires gpxpy
This script expects your input GPX to be located in a subdir named 'gpxFiles'

Command line args:
1 (required): file name, without file expension
2 (optional): color to set polyline to
"""

import os
import gpxpy
import gpxpy.gpx
import csv
import sys

outputdir = "gpxFiles"
os.path.exists(outputdir) or os.makedirs(outputdir)

try:
    color = sys.argv[2]
except:
    color = "black"

# put your GPX file in a subdir named 'gpxFiles'
fileName = sys.argv[1]
try:
    gpx_file = open(os.path.join("gpxFiles", fileName + ".gpx"), "r")
    gpx = gpxpy.parse(gpx_file)
except IOError:
    print("Couldn't open the input GPX file name " +
          fileName + ". Ensure it's in the 'gpxFiles' dir.")
    exit(-1)

# Create output txt file
outPath = os.path.join("gpxFiles", fileName + ".txt")
txtFile = open(outPath, "w")

# Write Polyline to txt file
txtFile.write("<Polyline\ncoordinates={[\n")
for track in gpx.tracks:
    for segment in track.segments:
        for point in segment.points:
            txtFile.write("{{ latitude: {0}, longitude: {1}}},\n".format(
                point.latitude, point.longitude))
txtFile.write(']}\nstrokeColor={"'+ color + '"}\nstrokeWidth={3}\n/>')


print("Output file converted successfully.")
print("Find file at: " + outPath)