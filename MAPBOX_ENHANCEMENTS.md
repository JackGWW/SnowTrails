# MapBox Enhancement Plan

This document outlines planned enhancements to SnowTrails after migrating to @rnmapbox/maps. Each enhancement will be implemented in a separate PR.

## Context

**Source of Truth**: `data/Trails.gpx` - single GPX file containing all trail tracks and waypoint markers

**Build Pipeline**:
1. `data/Trails.gpx` - Source GPX with trail tracks named like "Red Trail - Red" and waypoints
2. `data/format_trails_for_mapbox.py` - Formats GPX → `MapboxTrails.gpx`
3. `data/generate_trail_code.py` - Generates:
   - `data/json/*.json` - Individual trail coordinate arrays
   - `src/components/trails/*.js` - Individual trail components (60+)
   - `src/components/trails/AllTrails.js` - Imports all trails

**Current Map Architecture**:
- LiveMap.js: Main map component (class-based)
- Each trail renders: Markers (CustomMarker) + Line (ShapeSource + LineLayer)
- Map style: Custom Mapbox style (winter theme)
- Boundaries: SW [-80.398, 44.507], NE [-80.328, 44.539]

**Physical Map Reference**: [Image provided] - All visual styling must match the physical trail map

---

## PR #1: Remove Unused trailPattern State

**Branch**: `chore/remove-trail-pattern`

### Objective
Quick cleanup - remove dead code

### Changes
1. Remove `trailPattern: null` from LiveMap.js state
2. Remove `this.setState({ trailPattern: null })` from mapSetup
3. Update `generate_trail_code.py` templates to not pass trailPattern prop
4. Regenerate trail components

### Files to Modify
- `src/components/LiveMap.js` (lines 38, 59, 276)
- `data/code_templates.py` - Remove trailPattern from templates
- Run: `python data/generate_trail_code.py` to regenerate components

### Testing
- Load app, verify trails render correctly
- No functionality changes

---

## PR #2: Enhanced Line Styling

**Branch**: `feature/enhanced-trail-styling`

### Objective
Add visual styling that matches the physical map - dashed lines for specific trail types while keeping existing colors

### Changes

#### 1. Match Physical Map Patterns
Looking at the physical map:
- Most trails: **Solid lines** (current)
- Cross-country ski trails: **Dashed lines** (currently implemented)
- Some connector trails appear dotted

Keep existing solid colors matching the physical map:
- Red trails: #D50000
- Blue trails: #2962FF
- Green trails: #388E3C
- etc. (already in color_mapping)

#### 2. Update Line Rendering
Modify `data/code_templates.py`:
- Add zoom-responsive line width expression to `line_template`
- Currently uses fixed `lineWidth: 3`
- Change to: `lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5]`

Add rounded line styling:
```javascript
lineCap: 'round',
lineJoin: 'round',
```

#### 3. Maintain Existing Dash Pattern Logic
Currently working for Cross Country trails:
```python
if "cross country" in trail_name.lower():
    line_dash_array = "lineDasharray: [3, 3],"
```
Keep this, verify it matches physical map

### Files to Modify
- `data/code_templates.py` - Update line_template
- Run: `python data/generate_trail_code.py`

### Testing
- Verify zoom levels show appropriate line widths (14-18)
- Check cross-country trails still show dashed
- Compare colors to physical map screenshot
- Test on both iOS and Android

---

## PR #3: Consolidate Trail Rendering (Performance)

**Branch**: `feature/consolidated-trails`

### Objective
Replace 60+ individual ShapeSource components with one unified GeoJSON source for better performance

### Changes

#### 1. Update Python Generation Script
Modify `generate_trail_code.py` to output unified GeoJSON instead of individual components:

**New output**: `data/trails.geojson`
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Red Trail",
        "color": "#D50000",
        "lineDasharray": null,
        "distance": "1.39km",
        "elevation_gain": "148m",
        "elevation_loss": "17m"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[lon, lat], ...]
      }
    },
    ...
  ]
}
```

**New output**: `data/markers.geojson`
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "trail_name": "Red Trail",
        "icon": "square",
        "description": "1.39km - 148m↑ 17m↓"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
      }
    },
    ...
  ]
}
```

#### 2. Simplify AllTrails.js
Replace all 60+ component imports with:
```jsx
import trails from '../../../data/trails.geojson';

const AllTrails = () => {
  return (
    <Mapbox.ShapeSource id="all-trails" shape={trails}>
      <Mapbox.LineLayer
        id="trail-lines"
        style={{
          lineColor: ['get', 'color'],
          lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
          lineCap: 'round',
          lineJoin: 'round',
          lineDasharray: ['coalesce', ['get', 'lineDasharray'], ['literal', null]],
        }}
      />
    </Mapbox.ShapeSource>
  );
};
```

#### 3. Cleanup
- Delete all individual trail component files
- Keep markers rendering separately for now (using existing CustomMarker approach)

### Files to Modify
- `data/generate_trail_code.py` - Major refactor to output GeoJSON
- `src/components/trails/AllTrails.js` - Simplify to single source
- `src/components/LiveMap.js` - Update to only pass markerImages
- Delete 60+ individual trail files

### Testing
- Verify all 60+ trails render
- Check colors match
- Verify dashed trails still work
- Test trail tap detection
- Measure performance improvement (should see FPS improvement)

---

## PR #4: Convert to SymbolLayer Markers (Performance)

**Branch**: `feature/symbol-layer-markers`

### Objective
Replace MarkerView (React views) with SymbolLayer (native rendering) for better performance

### Changes

#### 1. Update Python Script
Modify `generate_trail_code.py` to output `data/markers.geojson` (see PR #3)

#### 2. Register Marker Icons in LiveMap.js
```jsx
<Mapbox.Images
  images={{
    circle: circleIcon,
    square: squareIcon,
    diamond: diamondIcon,
    bench: benchIcon,
  }}
/>
```

#### 3. Render Markers with SymbolLayer
```jsx
<Mapbox.ShapeSource id="trail-markers" shape={markerData}>
  <Mapbox.SymbolLayer
    id="marker-icons"
    style={{
      iconImage: ['get', 'icon'],
      iconSize: ['interpolate', ['linear'], ['zoom'], 14, 0.4, 16, 0.7, 18, 1.0],
      iconAllowOverlap: true,
    }}
  />
</Mapbox.ShapeSource>
```

#### 4. Callout Handling
- Keep CustomMarker component for "hidden marker" callout functionality
- On SymbolLayer tap → update hidden marker position → show callout
- Simpler than current approach

### Files to Modify
- `data/generate_trail_code.py` - Generate markers.geojson
- `src/components/LiveMap.js` - Add Images, ShapeSource, SymbolLayer
- `src/components/CustomMarker.js` - Keep for callout display only

### Testing
- All markers visible at correct locations
- Tap marker → callout appears
- Verify sizing at different zoom levels
- Check performance improvement

---

## PR #5: 3D Terrain

**Branch**: `feature/3d-terrain`

### Objective
Show elevation changes using 3D terrain rendering

### Changes

#### 1. Add Terrain to LiveMap.js
Before Camera component:
```jsx
<Mapbox.Terrain
  sourceID="mapbox-dem"
  exaggeration={1.5}
/>

<Mapbox.RasterDemSource
  id="mapbox-dem"
  url="mapbox://mapbox.terrain-rgb"
  tileSize={514}
  maxZoomLevel={14}
/>
```

#### 2. Add 2D/3D Toggle Button
- State: `is3DMode: false`
- Button next to location button
- Toggle camera pitch: 0 (2D) ↔ 45 (3D)

```jsx
<Mapbox.Camera
  pitch={this.state.is3DMode ? 45 : 0}
  ...
/>
```

### Files to Modify
- `src/components/LiveMap.js`

### Testing
- Verify terrain loads
- Toggle 2D/3D mode
- Check performance on device
- Ensure trails/markers visible on terrain

---

## PR #6: Trail Filtering

**Branch**: `feature/trail-filtering`

### Objective
Toggle trail visibility by type (snowshoe vs cross-country)

### Changes

#### 1. Add Trail Type to GPX Data
Modify `format_trails_for_mapbox.py` - already has `get_trail_type()`:
- "snowshoe" (default)
- "cross_country" (trails with "cross country" in name)

Include in trails.geojson properties

#### 2. Add Filter UI
Simple toggle switch in LiveMap.js:
- State: `{ showSnowshoe: true, showCrossCountry: true }`
- Two checkboxes or toggle buttons above legend
- Filter layer using expression

#### 3. Apply Filter
```jsx
<Mapbox.LineLayer
  filter={[
    'in',
    ['get', 'type'],
    ['literal', visibleTypes]
  ]}
/>
```

### Files to Modify
- `data/format_trails_for_mapbox.py` - Add type to properties
- `data/generate_trail_code.py` - Include type in GeoJSON
- `src/components/LiveMap.js` - Add filter UI and logic

### Testing
- Toggle filters on/off
- Verify correct trails show/hide
- Check that markers stay visible

---

## PR #7: GPS Tracking Mode

**Branch**: `feature/gps-tracking`

### Objective
"Follow me" mode that keeps user centered

### Changes

#### 1. Add Tracking State
```jsx
state = {
  isTracking: false,
  ...
}
```

#### 2. Update Camera
```jsx
<Mapbox.Camera
  followUserLocation={this.state.isTracking}
  followUserMode="compass"
  followZoomLevel={16}
/>
```

#### 3. Update Location Button
Multi-state button:
- First tap: Center on user (current)
- Second tap: Enable tracking (blue icon)
- Third tap: Disable tracking (default icon)
- Manual pan: Disable tracking

### Files to Modify
- `src/components/LiveMap.js`

### Testing
- Tap to enable tracking
- Verify camera follows movement
- Pan map → tracking disables
- Test with simulated location

---

## PR #8: Elevation Profile Display

**Branch**: `feature/elevation-profile`

### Objective
Show elevation chart when trail is tapped

### Changes

#### 1. Use Existing Elevation Data
`data/elevation_cache.json` already exists
Load this data and include in trails.geojson:
```json
"elevation_profile": [
  {"distance": 0, "elevation": 400},
  {"distance": 100, "elevation": 425},
  ...
]
```

#### 2. Create Simple Chart Component
Use `react-native-svg` to draw basic elevation profile:
- X-axis: distance along trail
- Y-axis: elevation
- Simple line chart, no fancy libraries needed

#### 3. Bottom Sheet Modal
When trail line is tapped:
- Show modal with trail name, stats, elevation chart
- Swipe down to close

### Files to Modify
- `data/generate_trail_code.py` - Include elevation in GeoJSON
- Create `src/components/ElevationProfile.js`
- `src/components/LiveMap.js` - Add onPress to LineLayer, modal

### Dependencies
- `react-native-svg` (may already be installed)

### Testing
- Tap trail → profile appears
- Verify elevation data accuracy
- Test dismiss gesture

---

## PR #9: Auto-Cache Offline Maps

**Branch**: `feature/offline-cache`

### Objective
Simple automatic tile caching - no UI needed, just cache tiles as they're viewed

### Changes

#### 1. Enable Built-in Tile Caching
MapBox GL automatically caches tiles, just need to ensure it's enabled:
```jsx
// In LiveMap.js, add to MapView
<Mapbox.MapView
  ...
  cacheEnabled={true}
/>
```

That's it - MapBox handles the rest automatically!

**Optional**: Add offline pack download for the specific region:
```jsx
// Download tiles for the bounded area on first load
Mapbox.offlineManager.createPack({
  name: 'SnowTrails',
  styleURL: 'mapbox://styles/jackgww/ckixum56n651w19npcrja4rnq',
  bounds: [[-80.398, 44.507], [-80.328, 44.539]],
  minZoom: 14,
  maxZoom: 18,
});
```

### Files to Modify
- `src/components/LiveMap.js`

### Testing
- View map with internet
- Disable internet
- Verify map tiles still load from cache
- Re-enable internet, verify new tiles cache

---

## Implementation Order

1. **PR #1** - Remove trailPattern (5 min)
2. **PR #2** - Enhanced styling (30 min)
3. **PR #3** - Consolidate trails (2-3 hours) ⚠️ Major refactor
4. **PR #4** - SymbolLayer markers (1 hour)
5. **PR #5** - 3D terrain (30 min)
6. **PR #6** - Trail filtering (1 hour)
7. **PR #7** - GPS tracking (45 min)
8. **PR #8** - Elevation profile (2 hours)
9. **PR #9** - Offline cache (15 min)

---

## Testing Strategy

**Manual Testing** (no automated tests needed):
- Build and run on device after each PR
- Test on both iOS and Android before merging
- Walk through core user flows:
  - Map loads with all trails visible
  - Tap marker → callout shows
  - Tap trail → info/profile shows
  - Location button centers on user
  - Zoom in/out → markers/lines scale appropriately

**Performance Checks**:
- PR #3, #4: Check FPS before/after (use React DevTools or device metrics)
- PR #5: Verify smooth terrain rendering
- PR #9: Confirm offline usage works

---

## Notes

- Keep all changes simple and focused
- Match physical map styling exactly
- No analytics, no fancy UI - just core functionality
- GeoJSON is human-readable and easier to debug than 60+ JS files
- Python scripts are source of truth - modify those, not generated code
- Each PR should be < 200 lines of meaningful code changes
