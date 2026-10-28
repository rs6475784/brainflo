# Bonfield Trail Cams (mockup)

A single-file dashboard mockup showing deer movement as a heat map across three
trail cameras near Bonfield, ON. Open `index.html` in any browser; there is no build step.

Cameras (from the dropped pins):

| Cam | Name        | Lat, Lon               |
|-----|-------------|------------------------|
| A   | Field South | 46.233885, -79.120745  |
| B   | NW Corner   | 46.236677, -79.122442  |
| C   | Pond Woods  | 46.221438, -79.112500  |

What it does:

- Heat map of movement along trails through each camera, redrawn as filters change
- Date range slider with per-day detection bars, moon markers, presets and a Play button
- Filters for time of day, deer type, wind direction and speed, pressure and trend,
  weather, moon phase and temperature (chip counts show matching detections)
- Click a camera to see its photos; click a photo for the full trail cam frame and conditions
- "Conditions during sightings" compares each condition's share of sightings to its share of hours

All detections, weather and photos are simulated with a seeded generator so the mockup
looks the same on every load. The aerial map is a hand-traced illustration, not imagery.
To wire up real data, replace the `genWeather` and `genEvents` blocks with your own
camera exports and weather history using the same event shape.
