#!/usr/bin/env python3
"""
iOS Simulator Location Simulator for SnowTrails

Simulates realistic hiking movement patterns within the map boundaries
and updates device heading/direction for testing location tracking.

All speeds are calibrated to realistic human movement:
- Slow walk: ~3 km/h (0.83 m/s)
- Normal hike: ~4-5 km/h (1.1-1.4 m/s)
- Fast hike: ~6 km/h (1.7 m/s)
- Jogging: ~8-10 km/h (2.2-2.8 m/s)
- Running (max): ~12 km/h (3.3 m/s)

Usage:
    python simulate_location.py [pattern]

Patterns:
    figure8     - Figure-8 pattern at hiking pace
    spiral      - Outward spiral from center
    zigzag      - Zigzag across the map
    random      - Random walk within bounds
    bruce       - Follow Bruce Trail coordinates
    green       - Follow Green Trail coordinates
    loop        - Hike a loop combining multiple trails
"""

import subprocess
import time
import math
import random
import argparse
import json
import os

# Map boundaries from LiveMap.js
BOUNDS = {
    'north': 44.539,
    'south': 44.507,
    'east': -80.328,
    'west': -80.398,
}

# Center of the map
CENTER_LAT = (BOUNDS['north'] + BOUNDS['south']) / 2  # 44.523
CENTER_LON = (BOUNDS['east'] + BOUNDS['west']) / 2    # -80.363

# Map dimensions in degrees
LAT_RANGE = BOUNDS['north'] - BOUNDS['south']  # 0.032
LON_RANGE = BOUNDS['east'] - BOUNDS['west']    # 0.070

# Speed constants (meters per second)
SPEEDS = {
    'slow_walk': 0.83,      # 3 km/h - leisurely stroll
    'normal_hike': 1.25,    # 4.5 km/h - typical hiking pace
    'fast_hike': 1.67,      # 6 km/h - brisk hiking
    'jog': 2.5,             # 9 km/h - jogging
    'run': 3.3,             # 12 km/h - running (max allowed)
}

# Conversion: 1 degree latitude ≈ 111,000 meters
# At latitude 44.5°, 1 degree longitude ≈ 79,000 meters
METERS_PER_LAT_DEG = 111000
METERS_PER_LON_DEG = 79000  # Approximate at this latitude

# Update interval in seconds
UPDATE_INTERVAL = 1.0

# Script directory for loading trail data
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, '..', 'data', 'json')


def meters_to_degrees(meters_lat: float, meters_lon: float) -> tuple:
    """Convert meters to degrees for lat/lon."""
    return (meters_lat / METERS_PER_LAT_DEG, meters_lon / METERS_PER_LON_DEG)


def degrees_to_meters(lat_deg: float, lon_deg: float) -> tuple:
    """Convert degrees to meters for lat/lon."""
    return (lat_deg * METERS_PER_LAT_DEG, lon_deg * METERS_PER_LON_DEG)


def set_location(lat: float, lon: float, heading: float = None):
    """Set the iOS simulator location and optionally heading."""
    # Clamp to bounds
    lat = max(BOUNDS['south'], min(BOUNDS['north'], lat))
    lon = max(BOUNDS['west'], min(BOUNDS['east'], lon))

    cmd = ['xcrun', 'simctl', 'location', 'booted', 'set', f'{lat},{lon}']
    subprocess.run(cmd, capture_output=True)

    if heading is not None:
        # Normalize heading to 0-360
        heading = heading % 360
        print(f"  Lat: {lat:.6f}, Lon: {lon:.6f}, Heading: {heading:.1f}°")
    else:
        print(f"  Lat: {lat:.6f}, Lon: {lon:.6f}")


def calculate_heading(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate heading/bearing from point 1 to point 2."""
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lon = math.radians(lon2 - lon1)

    x = math.sin(delta_lon) * math.cos(lat2_rad)
    y = math.cos(lat1_rad) * math.sin(lat2_rad) - \
        math.sin(lat1_rad) * math.cos(lat2_rad) * math.cos(delta_lon)

    heading = math.degrees(math.atan2(x, y))
    return (heading + 360) % 360


def calculate_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in meters between two points."""
    lat_diff = (lat2 - lat1) * METERS_PER_LAT_DEG
    lon_diff = (lon2 - lon1) * METERS_PER_LON_DEG
    return math.sqrt(lat_diff**2 + lon_diff**2)


def get_speed_for_pace(pace: str, speed_multiplier: float = 1.0) -> float:
    """Get speed in m/s for a given pace, capped at running speed."""
    base_speed = SPEEDS.get(pace, SPEEDS['normal_hike'])
    speed = base_speed * speed_multiplier
    # Cap at running speed (12 km/h = 3.3 m/s)
    return min(speed, SPEEDS['run'])


def load_trail_data(trail_name: str) -> list:
    """Load trail coordinates from JSON file."""
    file_path = os.path.join(DATA_DIR, f'{trail_name}.json')
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Trail file not found: {file_path}")
        return []


def interpolate_trail(trail_coords: list, speed_mps: float, interval: float = UPDATE_INTERVAL) -> list:
    """
    Interpolate trail coordinates to create smooth movement at given speed.
    Returns list of (lat, lon, heading) tuples.
    """
    if len(trail_coords) < 2:
        return []

    result = []
    distance_per_update = speed_mps * interval  # meters to travel per update

    i = 0
    current_lat = trail_coords[0]['latitude']
    current_lon = trail_coords[0]['longitude']

    while i < len(trail_coords) - 1:
        next_point = trail_coords[i + 1]
        target_lat = next_point['latitude']
        target_lon = next_point['longitude']

        dist_to_target = calculate_distance_meters(current_lat, current_lon, target_lat, target_lon)
        heading = calculate_heading(current_lat, current_lon, target_lat, target_lon)

        if dist_to_target <= distance_per_update:
            # Move to next waypoint
            current_lat = target_lat
            current_lon = target_lon
            result.append((current_lat, current_lon, heading))
            i += 1
        else:
            # Move towards target by distance_per_update
            ratio = distance_per_update / dist_to_target
            current_lat += (target_lat - current_lat) * ratio
            current_lon += (target_lon - current_lon) * ratio
            result.append((current_lat, current_lon, heading))

    return result


def figure8_pattern(duration: int = 120, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Generate a figure-8 pattern at hiking pace."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nRunning Figure-8 pattern for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    # Figure-8 dimensions (roughly 200m x 150m)
    radius_lat_m = 100  # meters
    radius_lon_m = 75   # meters

    radius_lat, radius_lon = meters_to_degrees(radius_lat_m, radius_lon_m)

    start_time = time.time()
    t = 0
    prev_lat, prev_lon = CENTER_LAT, CENTER_LON

    # Angular speed based on desired linear speed
    circumference = 2 * math.pi * max(radius_lat_m, radius_lon_m)
    angular_speed = (speed / circumference) * 2 * math.pi

    while time.time() - start_time < duration:
        # Figure-8 parametric equations
        lat = CENTER_LAT + radius_lat * math.sin(t)
        lon = CENTER_LON + radius_lon * math.sin(t) * math.cos(t)

        heading = calculate_heading(prev_lat, prev_lon, lat, lon)
        set_location(lat, lon, heading)

        prev_lat, prev_lon = lat, lon
        t += angular_speed * UPDATE_INTERVAL
        time.sleep(UPDATE_INTERVAL)

    print("Figure-8 pattern complete!")


def spiral_pattern(duration: int = 120, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Generate an outward spiral pattern at hiking pace."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nRunning Spiral pattern for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    start_time = time.time()
    angle = 0
    radius_m = 5  # Start 5 meters from center
    prev_lat, prev_lon = CENTER_LAT, CENTER_LON

    while time.time() - start_time < duration:
        # Convert radius to degrees
        radius_lat, radius_lon = meters_to_degrees(radius_m, radius_m)

        lat = CENTER_LAT + radius_lat * math.cos(angle)
        lon = CENTER_LON + radius_lon * math.sin(angle)

        heading = calculate_heading(prev_lat, prev_lon, lat, lon)
        set_location(lat, lon, heading)

        prev_lat, prev_lon = lat, lon

        # Move along spiral - distance traveled = speed * time
        # For spiral, we increase both angle and radius
        distance_per_update = speed * UPDATE_INTERVAL
        # Approximate: move mostly along circumference, slowly outward
        circumference = 2 * math.pi * radius_m if radius_m > 0 else 1
        angle += (distance_per_update * 0.9) / max(radius_m, 1)  # 90% tangential
        radius_m += distance_per_update * 0.1  # 10% outward

        # Reset if we get too far from center (500m)
        if radius_m > 500:
            radius_m = 5
            angle = random.uniform(0, 2 * math.pi)
            print("  -- Resetting spiral to center --")

        time.sleep(UPDATE_INTERVAL)

    print("Spiral pattern complete!")


def zigzag_pattern(duration: int = 120, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Generate a zigzag pattern at hiking pace."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nRunning Zigzag pattern for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    # Start position
    lat = BOUNDS['south'] + LAT_RANGE * 0.15
    lon = BOUNDS['west'] + LON_RANGE * 0.15

    # Movement per update in meters
    distance_per_update = speed * UPDATE_INTERVAL

    # Zigzag: mostly east/west, slowly north
    direction = 1  # 1 = east, -1 = west

    start_time = time.time()
    prev_lat, prev_lon = lat, lon

    while time.time() - start_time < duration:
        heading = calculate_heading(prev_lat, prev_lon, lat, lon) if (prev_lat != lat or prev_lon != lon) else (90 if direction > 0 else 270)
        set_location(lat, lon, heading)

        prev_lat, prev_lon = lat, lon

        # Convert distance to degrees
        _, lon_delta = meters_to_degrees(0, distance_per_update * 0.95)
        lat_delta, _ = meters_to_degrees(distance_per_update * 0.05, 0)

        lon += lon_delta * direction
        lat += lat_delta  # Slowly move north

        # Check bounds and reverse direction
        if lon >= BOUNDS['east'] - LON_RANGE * 0.15:
            direction = -1
        elif lon <= BOUNDS['west'] + LON_RANGE * 0.15:
            direction = 1

        # Reset if we've gone too far north
        if lat >= BOUNDS['north'] - LAT_RANGE * 0.15:
            lat = BOUNDS['south'] + LAT_RANGE * 0.15
            print("  -- Resetting to south --")

        time.sleep(UPDATE_INTERVAL)

    print("Zigzag pattern complete!")


def random_walk_pattern(duration: int = 120, pace: str = 'slow_walk', speed_multiplier: float = 1.0):
    """Generate a random walk at hiking pace."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nRunning Random Walk pattern for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    lat = CENTER_LAT
    lon = CENTER_LON
    heading = random.uniform(0, 360)

    distance_per_update = speed * UPDATE_INTERVAL

    start_time = time.time()

    while time.time() - start_time < duration:
        set_location(lat, lon, heading)

        # Gradual heading change (like a real hiker - not sharp turns)
        heading += random.uniform(-15, 15)
        heading = heading % 360

        # Move in heading direction
        lat_delta, lon_delta = meters_to_degrees(
            distance_per_update * math.cos(math.radians(heading)),
            distance_per_update * math.sin(math.radians(heading))
        )
        lat += lat_delta
        lon += lon_delta

        # Bounce off bounds (turn around)
        margin_lat, margin_lon = meters_to_degrees(50, 50)  # 50m margin

        if lat <= BOUNDS['south'] + margin_lat:
            heading = random.uniform(0, 180)  # Point north
        elif lat >= BOUNDS['north'] - margin_lat:
            heading = random.uniform(180, 360)  # Point south

        if lon <= BOUNDS['west'] + margin_lon:
            heading = random.uniform(45, 135)  # Point east
        elif lon >= BOUNDS['east'] - margin_lon:
            heading = random.uniform(225, 315)  # Point west

        time.sleep(UPDATE_INTERVAL)

    print("Random walk complete!")


def trail_pattern(trail_name: str, duration: int = 180, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Follow an actual trail from the trail data."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nFollowing {trail_name} for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    trail_coords = load_trail_data(trail_name)
    if not trail_coords:
        print(f"Could not load trail: {trail_name}")
        return

    print(f"  Trail has {len(trail_coords)} waypoints")

    # Interpolate trail for smooth movement
    interpolated = interpolate_trail(trail_coords, speed, UPDATE_INTERVAL)
    if not interpolated:
        print("Could not interpolate trail")
        return

    print(f"  Interpolated to {len(interpolated)} points")

    start_time = time.time()
    point_idx = 0
    direction = 1  # 1 = forward, -1 = backward

    while time.time() - start_time < duration:
        lat, lon, heading = interpolated[point_idx]

        # Adjust heading if going backward
        if direction == -1:
            heading = (heading + 180) % 360

        set_location(lat, lon, heading)

        point_idx += direction

        # Reverse direction at trail ends
        if point_idx >= len(interpolated):
            direction = -1
            point_idx = len(interpolated) - 2
            print("  -- Reached end, turning around --")
        elif point_idx < 0:
            direction = 1
            point_idx = 1
            print("  -- Reached start, turning around --")

        time.sleep(UPDATE_INTERVAL)

    print(f"{trail_name} pattern complete!")


def bruce_trail_pattern(duration: int = 180, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Follow the Bruce Trail."""
    trail_pattern('BruceTrail', duration, pace, speed_multiplier)


def green_trail_pattern(duration: int = 180, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Follow the Green Trail."""
    trail_pattern('GreenTrail', duration, pace, speed_multiplier)


def loop_pattern(duration: int = 300, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Hike a loop combining multiple trails."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nHiking trail loop for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    # Load multiple trails and combine them
    trails_to_combine = ['GreenTrail', 'BruceTrailLoop', 'LoreeForest']
    all_coords = []

    for trail_name in trails_to_combine:
        coords = load_trail_data(trail_name)
        if coords:
            print(f"  Loaded {trail_name}: {len(coords)} points")
            all_coords.extend(coords)

    if not all_coords:
        print("Could not load any trails for loop")
        return

    # Interpolate for smooth movement
    interpolated = interpolate_trail(all_coords, speed, UPDATE_INTERVAL)
    if not interpolated:
        print("Could not interpolate trail loop")
        return

    print(f"  Total interpolated points: {len(interpolated)}")

    start_time = time.time()
    point_idx = 0

    while time.time() - start_time < duration:
        lat, lon, heading = interpolated[point_idx % len(interpolated)]
        set_location(lat, lon, heading)

        point_idx += 1

        if point_idx % len(interpolated) == 0:
            print("  -- Completed loop, starting again --")

        time.sleep(UPDATE_INTERVAL)

    print("Loop pattern complete!")


def complex_route_pattern(duration: int = 180, pace: str = 'normal_hike', speed_multiplier: float = 1.0):
    """Complex pattern with waypoints at hiking pace."""
    speed = get_speed_for_pace(pace, speed_multiplier)
    print(f"\nRunning Complex Route for {duration}s at {speed:.1f} m/s ({speed * 3.6:.1f} km/h)...")

    # Define waypoints (roughly following trails area)
    waypoints = [
        {'latitude': CENTER_LAT, 'longitude': CENTER_LON},
        {'latitude': CENTER_LAT + 0.003, 'longitude': CENTER_LON + 0.004},
        {'latitude': CENTER_LAT + 0.005, 'longitude': CENTER_LON - 0.002},
        {'latitude': CENTER_LAT + 0.002, 'longitude': CENTER_LON - 0.006},
        {'latitude': CENTER_LAT - 0.002, 'longitude': CENTER_LON - 0.004},
        {'latitude': CENTER_LAT - 0.004, 'longitude': CENTER_LON + 0.002},
        {'latitude': CENTER_LAT - 0.001, 'longitude': CENTER_LON + 0.005},
        {'latitude': CENTER_LAT, 'longitude': CENTER_LON},  # Return to start
    ]

    interpolated = interpolate_trail(waypoints, speed, UPDATE_INTERVAL)
    if not interpolated:
        print("Could not interpolate route")
        return

    start_time = time.time()
    point_idx = 0

    while time.time() - start_time < duration:
        lat, lon, heading = interpolated[point_idx % len(interpolated)]
        set_location(lat, lon, heading)

        point_idx += 1

        if point_idx % len(interpolated) == 0:
            print("  -- Completed route, starting again --")

        time.sleep(UPDATE_INTERVAL)

    print("Complex route complete!")


PATTERNS = {
    'figure8': figure8_pattern,
    'spiral': spiral_pattern,
    'zigzag': zigzag_pattern,
    'random': random_walk_pattern,
    'bruce': bruce_trail_pattern,
    'green': green_trail_pattern,
    'loop': loop_pattern,
    'complex': complex_route_pattern,
}

PACES = list(SPEEDS.keys())


def main():
    parser = argparse.ArgumentParser(
        description='Simulate iOS Simulator location for SnowTrails testing (hiking pace)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        'pattern',
        nargs='?',
        default='figure8',
        choices=list(PATTERNS.keys()),
        help='Movement pattern to simulate (default: figure8)'
    )
    parser.add_argument(
        '-d', '--duration',
        type=int,
        default=120,
        help='Duration in seconds (default: 120)'
    )
    parser.add_argument(
        '-s', '--speed',
        type=float,
        default=1.0,
        help='Speed multiplier, capped at running pace (default: 1.0)'
    )
    parser.add_argument(
        '-p', '--pace',
        choices=PACES,
        default='normal_hike',
        help='Base pace (default: normal_hike)'
    )
    parser.add_argument(
        '-l', '--list',
        action='store_true',
        help='List available patterns and exit'
    )

    args = parser.parse_args()

    if args.list:
        print("Available patterns:")
        print("  figure8  - Figure-8 pattern around center")
        print("  spiral   - Outward spiral from center")
        print("  zigzag   - Zigzag across the map")
        print("  random   - Random walk within bounds")
        print("  bruce    - Follow Bruce Trail")
        print("  green    - Follow Green Trail")
        print("  loop     - Hike a loop of multiple trails")
        print("  complex  - Complex waypoint route")
        print()
        print("Available paces:")
        for name, speed in SPEEDS.items():
            print(f"  {name:12} - {speed:.2f} m/s ({speed * 3.6:.1f} km/h)")
        return

    effective_speed = get_speed_for_pace(args.pace, args.speed)

    print("=" * 50)
    print("SnowTrails Location Simulator (Hiking Pace)")
    print("=" * 50)
    print(f"Map bounds:")
    print(f"  North: {BOUNDS['north']}, South: {BOUNDS['south']}")
    print(f"  East: {BOUNDS['east']}, West: {BOUNDS['west']}")
    print(f"  Center: {CENTER_LAT:.4f}, {CENTER_LON:.4f}")
    print(f"\nPattern: {args.pattern}")
    print(f"Duration: {args.duration}s")
    print(f"Pace: {args.pace} ({SPEEDS[args.pace]:.2f} m/s)")
    print(f"Speed multiplier: {args.speed}x")
    print(f"Effective speed: {effective_speed:.2f} m/s ({effective_speed * 3.6:.1f} km/h)")
    if effective_speed >= SPEEDS['run']:
        print("  (capped at max running speed)")
    print("\nPress Ctrl+C to stop early\n")

    try:
        PATTERNS[args.pattern](duration=args.duration, pace=args.pace, speed_multiplier=args.speed)
    except KeyboardInterrupt:
        print("\n\nSimulation stopped by user.")

    print("\nDone!")


if __name__ == '__main__':
    main()
