# Bonfield Trail Cams (mockup)

A single-file dashboard mockup showing deer movement as a heat map across three
trail cameras near Bonfield, ON. Open `index.html` in any browser; there is no build step.

## Google Maps satellite

The map has two base layers: a hand-drawn illustration (works offline, no key) and
Google satellite imagery. To use Google:

1. In Google Cloud, create a browser API key with the **Maps JavaScript API** enabled
   (billing must be on; the monthly free tier covers personal use).
2. Restrict the key to the address you open the page from, e.g. `http://localhost:8000/*`.
3. Serve the folder and open it with the key:

   ```sh
   cd mockups/deer-heatmap && python3 -m http.server 8000
   # then visit http://localhost:8000/?key=YOUR_KEY
   ```

   Or click **Google satellite** above the map and paste the key. It is saved in that
   browser only, and a rejected key is cleared automatically.

Opening the file directly (`file://`) only works with an unrestricted key. The heat
layer and camera markers sit on Google's map in a custom overlay, so they stay locked
to the coordinates as you pan and zoom. Google's own HeatmapLayer has been retired,
so it is not used. The Claude artifact preview cannot load Google Maps (its security
policy blocks outside map scripts), so it shows the illustrated map with an explanation.

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
