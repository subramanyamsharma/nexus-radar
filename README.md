# nexus-radar
Nexus Radar is a real-time global tracking dashboard built in a single HTML file. Track live flights, orbital satellites, maritime vessels, and ground traffic on interactive dark maps — powered by React, Leaflet.js &amp; OpenSky API. No install needed. Just open and explore.
🌐 NEXUS RADAR — Global Tracking Command

Nexus Radar is a high-performance, real-time global tracking dashboard built with React and Leaflet.js. Designed with a sleek, dark-mode "sci-fi command center" aesthetic, it allows users to monitor thousands of moving objects across four distinct domains: Aviation, Orbital Space, Maritime, and Terrestrial Ground Traffic.

Whether you're tracking live commercial flights or calculating the orbital ETA of satellite constellations, Nexus Radar provides a seamless, interactive, and visually stunning data-visualization experience.

✨ Key Features

Nexus Radar is divided into four primary telemetry modules:

✈️ 1. Flight Radar (Aviation)

Live Data: Fetches real-time telemetry from the OpenSky Network API.

Massive Scale: Tracks up to 2,500 commercial aircraft simultaneously.

Smart Fallback: If the API rate-limits, the engine seamlessly falls back to a realistic procedural flight simulator across real-world airline routes.

Metrics: View Callsign, Operator, Altitude, Speed (kts), Heading, and Origin/Destination.

🛰️ 2. Satellite Tracker (Orbital Space)

Dynamic Constellations: Tracks 1,500+ satellites, including the ISS, Hubble, military payloads, weather satellites, and simulated Starlink/OneWeb communication swarms.

Orbital Mechanics: Calculates Low Earth Orbit (LEO), Medium Earth Orbit (MEO), and Geostationary (GEO) trajectories in real-time.

Live ETAs: Select a target country/city to instantly calculate the Haversine distance and Estimated Time of Arrival (ETA) for any satellite passing overhead.

🚢 3. Maritime Radar (Shipping)

Global Logistics: Simulates 2,500+ cargo ships, oil tankers, passenger liners, and military vessels.

Trade Routes: Vessels mathematically navigate between major global ports (Shanghai, Rotterdam, Los Angeles, Suez Canal, etc.).

Metrics: View Vessel Type, Maritime Flag, Route, and Speed.

🚙 4. Ground Traffic (Terrestrial Radar)

City-Level Tracking: Simulates 2,500+ cars, trucks, and transit vehicles scattered across major global metropolitan areas.

Hierarchical Filtering: Drill down through live traffic using cascaded filters: Country ➔ State/Region ➔ Local City.

📈 Additional Features

Monetization Ready: Pre-configured with Google AdSense <ins> slots, a GDPR/CCPA cookie consent banner, and an "About/Policy" tab to meet strict AdSense SPA approval requirements.

Responsive UI: Fluid CSS grids, real-time data tickers, animated load states, and color-coded telemetry.

CartoDB Dark Matter: Uses highly optimized, dark-themed map tiles that do not require API keys or strict referrers.

🛠️ Tech Stack

Frontend Framework: React 18 (Using Hooks: useState, useEffect, useRef, useMemo)

Mapping Engine: Leaflet.js (react-leaflet logic implemented via direct DOM manipulation for maximum performance with 10,000+ markers)

Map Tiles: CartoDB Dark Matter

Live APIs: OpenSky Network (Aviation), WhereTheISS.at (ISS telemetry)

Styling: Pure CSS3 with CSS Variables for dynamic theme switching.

🚀 Installation & Usage

Nexus Radar is designed to be highly portable. It can be run as a standard React component or as a standalone Single-Page Application (SPA).

Option 1: Standalone HTML (Zero Build Required)

Download the index.html file.

Double-click to open it in any modern web browser.

Note: The standalone version uses Babel and React via CDN. It requires an active internet connection to load the libraries and map tiles.

Option 2: React Project Integration

If you are using Vite, Next.js, or Create React App:

Copy the App.jsx component code.

Paste it into your project.

Ensure you do not have conflicting global CSS that overrides the #root or body margins.

Run your development server: npm run dev or npm start.

💰 AdSense Configuration

If you intend to host this and monetize it via Google AdSense:

Open the code and search for ca-pub-XXXXXXXXXXXXXXXX.

Replace it with your actual Google AdSense Publisher ID.

Replace the slotId props inside the <AdSenseWidget /> components with your actual Ad Unit IDs.

Host the site on a Top-Level Domain (e.g., .com, .net). Free subdomains (like .netlify.app) are generally rejected by Google.

⚠️ Disclaimer

Not for navigation or emergency use. While the Aviation module attempts to pull live data from public APIs, the Maritime, Ground Traffic, and massive Satellite Swarm features are driven by mathematical procedural generation algorithms to simulate global traffic for visualization, educational, and entertainment purposes.

📜 License

Distributed under the MIT License. See LICENSE for more information.
