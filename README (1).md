# 🛰 NEXUS RADAR — Global Tracking Command

> A real-time global tracking dashboard visualizing flights, satellites, maritime vessels, and ground traffic — all in one sleek, space-themed interface.

![NEXUS RADAR](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet.js-199900?style=flat-square&logo=leaflet&logoColor=white)

---

## 🌐 Live Demo

**[https://YOUR_USERNAME.github.io/nexus-radar](https://YOUR_USERNAME.github.io/nexus-radar)**

> Replace with your actual GitHub Pages URL after deployment.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| ✈ **Flight Radar** | Tracks live global aircraft via the OpenSky Network API. Falls back to procedurally generated flights if the API is unavailable. |
| 🛰 **Satellite Tracker** | Tracks 100+ named satellites (ISS, Hubble, Starlink, GPS, weather sats) with real-time orbital position simulation. Live ISS/Tiangong data from wheretheiss.at. |
| 🚢 **Maritime Radar** | Simulates 400+ vessels across major global shipping lanes and ports. |
| 🚙 **Ground Traffic** | Simulates 500+ vehicles across 19 cities in 8 countries with hierarchical country/state/city filtering. |
| 📄 **About & Policy** | Privacy policy and AdSense-compliant content page. |

---

## 🖥 Tech Stack

- **React 18** (via CDN, no build step required)
- **Leaflet.js** — interactive maps with dark CartoDB tiles
- **OpenSky Network API** — live flight data
- **wheretheiss.at API** — live ISS & Tiangong position
- **Vanilla JS** — no Babel, no bundler, no framework overhead
- **Google Fonts** — Space Grotesk, JetBrains Mono, Syne
- **Google AdSense** — monetization ready

---

## 📁 File Structure

```
nexus-radar/
├── index.html      # Entry point — loads all scripts and styles
├── styles.css      # All UI styles (glassmorphism, dark space theme)
├── data.js         # Static data, generator functions, icon makers
├── app.js          # Main React app (compiled to plain JS, no Babel)
├── README.md       # This file
└── LICENSE         # MIT License
```

---

## 🚀 Getting Started

### Option 1 — VS Code Live Server (Recommended)
1. Open the `nexus-radar` folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Visit `http://127.0.0.1:5500`

### Option 2 — Python
```bash
cd nexus-radar
python -m http.server 8080
# Open http://localhost:8080
```

### Option 3 — Node.js
```bash
cd nexus-radar
npx serve .
```

> ⚠️ Do NOT open `index.html` by double-clicking it. Browsers block cross-file JS imports over the `file://` protocol. Always use a local server.

---

## ⚙️ Configuration

### AdSense Setup
Replace the placeholder publisher ID in two places:

**`index.html`** (line 14):
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" ...>
```

**`app.js`** (AdSenseWidget component):
```js
'data-ad-client': 'ca-pub-XXXXXXXXXXXXXXXX'
```

### Data Volume Tuning
You can adjust simulation counts in `data.js`:
```js
generateShips(400)       // increase for more vessels
generateVehicles(500)    // increase for more vehicles
generateSwarmSatellites(300)  // increase for more Starlink/OneWeb
```

---

## 🗺 Map Controls

Each tracking module includes quick-zoom buttons:

- **Flight Radar** — World, Europe, N. America, Asia, Africa, Oceania
- **Maritime Radar** — World, Atlantic, Pacific, Indian Ocean
- **Ground Traffic** — World, USA, India, UK

Click any item in the sidebar list to fly the map to that object and see its details.

---

## 📡 Data Sources

| Source | Usage |
|--------|-------|
| [OpenSky Network](https://opensky-network.org) | Live flight states (free, anonymous, rate-limited) |
| [wheretheiss.at](https://wheretheiss.at) | Live ISS & Tiangong position |
| Procedural generation | Ships, vehicles, most satellites (when APIs unavailable) |

> All satellite orbital positions use a physics-based approximation (period, inclination, NORAD ID seed) — not real TLE propagation. Suitable for visualization and education.

---

## 📸 Screenshots

> _Add your own screenshots here after deployment._
> Tip: Press `F12` → Device Toolbar in Chrome to capture a nice mobile view too.

---

## 🛠 Performance Optimizations

Compared to a typical single-file JSX app:

- **No Babel** — JSX compiled to `React.createElement()` at author time, not at runtime in the browser
- **Separate files** — `styles.css`, `data.js`, `app.js` are individually cached by Netlify/GitHub Pages CDN
- **Reduced data counts** — sidebar lists capped at 400–500 DOM nodes for smooth scrolling
- **Lazy tab init** — Leaflet maps only initialize when their tab is first visited

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- [OpenSky Network](https://opensky-network.org) for the free flight data API
- [CartoDB](https://carto.com) for the beautiful dark map tiles
- [Leaflet.js](https://leafletjs.com) for the mapping library
- [wheretheiss.at](https://wheretheiss.at) for the ISS tracking API

---

*Built with ☕ and a love for maps.*
