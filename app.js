// ===== NEXUS RADAR — Main App (Plain JS, no Babel required) =====
// Uses React.createElement() directly instead of JSX

const { useState, useEffect, useRef, useMemo } = React;
const h = React.createElement;

// ── AdSense Widget ──
function AdSenseWidget({ slotId, style }) {
  useEffect(() => {
    try { if (window) (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch(e) { console.error('AdSense error:', e); }
  }, []);
  return h('div', {
    style: { background: 'rgba(129,140,248,0.03)', border: '1px dashed rgba(99,102,241,0.25)',
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             overflow: 'hidden', position: 'relative', borderRadius: '8px', ...style }
  },
    h('ins', { className: 'adsbygoogle', style: { display:'block', width:'100%', height:'100%' },
               'data-ad-client': 'ca-pub-XXXXXXXXXXXXXXXX', 'data-ad-slot': slotId,
               'data-ad-format': 'auto', 'data-full-width-responsive': 'true' }),
    h('span', { style: { position:'absolute', zIndex:-1, fontSize:'10px', color:'rgba(99,117,180,0.4)', letterSpacing:'2px' } }, 'ADVERTISEMENT')
  );
}

// ── Main App ──
function App() {
  const [activeTab, setActiveTab] = useState('flight');
  const [currentTime, setCurrentTime] = useState('');
  const [cookieAccepted, setCookieAccepted] = useState(false);

  const [flightData, setFlightData] = useState([]);
  const [satData, setSatData] = useState([]);
  const [shipData, setShipData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSat, setSelectedSat] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [flightSearch, setFlightSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [satSearch, setSatSearch] = useState('');
  const [satTypeFilter, setSatTypeFilter] = useState('');
  const [shipSearch, setShipSearch] = useState('');
  const [shipTypeFilter, setShipTypeFilter] = useState('');
  const [targetCountryVal, setTargetCountryVal] = useState('20,77');

  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleCountry, setVehicleCountry] = useState('');
  const [vehicleState, setVehicleState] = useState('');
  const [vehicleCity, setVehicleCity] = useState('');

  const [flightLoading, setFlightLoading] = useState(true);
  const [satLoading, setSatLoading] = useState(true);
  const [shipLoading, setShipLoading] = useState(true);
  const [vehicleLoading, setVehicleLoading] = useState(true);

  const flightMapRef = useRef(null);
  const satMapRef = useRef(null);
  const shipMapRef = useRef(null);
  const roadMapRef = useRef(null);
  const flightMarkersRef = useRef({});
  const satMarkersRef = useRef({});
  const shipMarkersRef = useRef({});
  const roadMarkersRef = useRef({});
  const satOrbitLinesRef = useRef([]);

  // Cookie consent
  useEffect(() => {
    if (localStorage.getItem('nexus_cookie_consent') === 'true') setCookieAccepted(true);
  }, []);

  // Clock
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date().toISOString().replace('T',' ').slice(0,19)+' UTC');
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Init Maps
  useEffect(() => {
    const L = window.L; if (!L) return;
    const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
    const makeMap = (id, ref) => {
      if (!ref.current && document.getElementById(id)) {
        ref.current = L.map(id, { zoomControl: false }).setView([20, 0], 2);
        L.control.zoom({ position: 'bottomright' }).addTo(ref.current);
        L.tileLayer(tileUrl, { attribution: tileAttr, maxZoom: 19 }).addTo(ref.current);
      }
    };
    makeMap('flight-map', flightMapRef);
    makeMap('sat-map', satMapRef);
    makeMap('ship-map', shipMapRef);
    makeMap('road-map', roadMapRef);
  }, [activeTab]);

  // Resize on tab switch
  useEffect(() => {
    setTimeout(() => {
      if (activeTab==='flight' && flightMapRef.current) flightMapRef.current.invalidateSize();
      if (activeTab==='sat' && satMapRef.current) satMapRef.current.invalidateSize();
      if (activeTab==='ship' && shipMapRef.current) shipMapRef.current.invalidateSize();
      if (activeTab==='road' && roadMapRef.current) roadMapRef.current.invalidateSize();
    }, 100);
  }, [activeTab]);

  // Data loaders
  const loadFlights = async () => {
    setFlightLoading(true);
    try {
      const res = await fetch('https://opensky-network.org/api/states/all', { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error('no');
      const json = await res.json();
      const states = (json.states || []).filter(s => s[5] && s[6]).slice(0, 1500);
      if (states.length < 20) throw new Error('few');
      const parsed = states.map((s, i) => {
        const cs = (s[1]||'').trim()||'N/A';
        const rr = ROUTE_DB[i % ROUTE_DB.length];
        return { callsign:cs, originCity:'Enroute', originCountry:s[2]||'Unknown', destCity:rr[4], destCountry:rr[5],
                 operator:s[2]||'Unknown', country:s[2]||'Unknown', lat:s[6], lon:s[5],
                 alt:s[7]?Math.round(s[7]):null, spd:s[9]?Math.round(s[9]*1.944):null, hdg:s[10]||0,
                 icao:s[0]||('X'+i) };
      });
      setFlightData(parsed);
    } catch(e) { setFlightData(generateFlights()); }
    finally { setFlightLoading(false); }
  };

  const loadSatellites = async () => {
    setSatLoading(true);
    const results = [];
    for (const sat of ALL_SATELLITES) {
      if (sat.noradId === 25544 || sat.noradId === 48274) {
        try {
          const r = await fetch(`https://api.wheretheiss.at/v1/satellites/${sat.noradId}`, { signal: AbortSignal.timeout(4000) });
          if (r.ok) {
            const d = await r.json();
            results.push({...sat, lat:d.latitude, lon:d.longitude, alt:Math.round(d.altitude),
                          vel:parseFloat((d.velocity/1000).toFixed(2)), footprint:d.footprint, visibility:d.visibility});
            continue;
          }
        } catch(e) {}
      }
      results.push(generateFakeSat(sat));
    }
    const swarm = generateSwarmSatellites(300).map(s => generateFakeSat(s));
    results.push(...swarm);
    setSatData(results);
    setSatLoading(false);
  };

  const loadShips = () => {
    setShipLoading(true);
    setTimeout(() => { setShipData(generateShips(400)); setShipLoading(false); }, 800);
  };

  const loadVehicles = () => {
    setVehicleLoading(true);
    setTimeout(() => { setVehicleData(generateVehicles(500)); setVehicleLoading(false); }, 600);
  };

  useEffect(() => {
    loadFlights(); loadSatellites(); loadShips(); loadVehicles();
    const fi = setInterval(loadFlights, 60000);
    const si = setInterval(loadSatellites, 30000);
    const mi = setInterval(loadShips, 120000);
    const vi = setInterval(loadVehicles, 15000);
    return () => { clearInterval(fi); clearInterval(si); clearInterval(mi); clearInterval(vi); };
  }, []);

  // Filters
  const filteredFlights = useMemo(() => {
    const s = flightSearch.toLowerCase();
    return flightData.filter(f => {
      const ms = !s||(f.callsign.toLowerCase().includes(s)||(f.operator||'').toLowerCase().includes(s)||(f.originCity||'').toLowerCase().includes(s)||(f.destCity||'').toLowerCase().includes(s));
      const mc = !countryFilter||(f.country===countryFilter||f.originCountry===countryFilter);
      return ms&&mc;
    });
  }, [flightData, flightSearch, countryFilter]);

  const uniqueCountries = useMemo(() => [...new Set(flightData.map(f=>f.country||f.originCountry).filter(Boolean))].sort(), [flightData]);
  const targetCoords = useMemo(() => { const [lt,ln]=targetCountryVal.split(',').map(Number); return{lat:lt,lon:ln}; }, [targetCountryVal]);

  const filteredSats = useMemo(() => {
    const ns = satSearch.toLowerCase();
    return satData.filter(s=>(!satTypeFilter||s.type===satTypeFilter)&&(!ns||s.name.toLowerCase().includes(ns)||s.type.toLowerCase().includes(ns)));
  }, [satData, satSearch, satTypeFilter]);

  const filteredShips = useMemo(() => {
    const s = shipSearch.toLowerCase();
    return shipData.filter(shp=>{
      const ms=!s||(shp.name.toLowerCase().includes(s)||shp.origin.toLowerCase().includes(s)||shp.dest.toLowerCase().includes(s)||shp.flag.toLowerCase().includes(s));
      return ms&&(!shipTypeFilter||shp.type===shipTypeFilter);
    });
  }, [shipData, shipSearch, shipTypeFilter]);

  const availableRoadCountries = useMemo(()=>[...new Set(vehicleData.map(v=>v.country))].sort(),[vehicleData]);
  const availableRoadStates = useMemo(()=>!vehicleCountry?[]:[...new Set(vehicleData.filter(v=>v.country===vehicleCountry).map(v=>v.state))].sort(),[vehicleData,vehicleCountry]);
  const availableRoadCities = useMemo(()=>!vehicleState?[]:[...new Set(vehicleData.filter(v=>v.state===vehicleState).map(v=>v.city))].sort(),[vehicleData,vehicleState]);

  const filteredVehicles = useMemo(()=>{
    const s=vehicleSearch.toLowerCase();
    return vehicleData.filter(v=>(!s||(v.id.toLowerCase().includes(s)||v.type.toLowerCase().includes(s)))&&(!vehicleCountry||v.country===vehicleCountry)&&(!vehicleState||v.state===vehicleState)&&(!vehicleCity||v.city===vehicleCity));
  },[vehicleData,vehicleSearch,vehicleCountry,vehicleState,vehicleCity]);

  // Map marker updates
  useEffect(()=>{
    if(!flightMapRef.current)return;
    const map=flightMapRef.current;
    Object.values(flightMarkersRef.current).forEach(m=>map.removeLayer(m));
    flightMarkersRef.current={};
    filteredFlights.forEach(f=>{
      const m=window.L.marker([f.lat,f.lon],{icon:makePlaneIcon(f.hdg)});
      m.bindPopup(`<div class="popup-title">✈ ${f.callsign}</div>
        <div class="popup-row"><span>OPERATOR</span><span>${f.operator||f.country}</span></div>
        <div class="popup-row"><span>FROM</span><span>${f.originCity||'?'}, ${f.originCountry||'?'}</span></div>
        <div class="popup-row"><span>TO</span><span>${f.destCity||'?'}, ${f.destCountry||'?'}</span></div>
        <div class="popup-row"><span>ALTITUDE</span><span>${f.alt?f.alt+'m':'—'}</span></div>
        <div class="popup-row"><span>SPEED</span><span>${f.spd?f.spd+' kts':'—'}</span></div>
        <div class="popup-row"><span>HEADING</span><span>${Math.round(f.hdg)}°</span></div>`);
      m.on('click',()=>setSelectedFlight(f));
      m.addTo(map); flightMarkersRef.current[f.icao]=m;
    });
  },[filteredFlights]);

  useEffect(()=>{
    if(!satMapRef.current)return;
    const map=satMapRef.current;
    satOrbitLinesRef.current.forEach(l=>map.removeLayer(l)); satOrbitLinesRef.current=[];
    Object.values(satMarkersRef.current).forEach(m=>map.removeLayer(m)); satMarkersRef.current={};
    filteredSats.forEach(sat=>{
      const eta=calcETA(sat,targetCoords);
      const orbit=sat.alt>30000?'GEO':sat.alt>5000?'MEO':'LEO';
      const m=window.L.marker([sat.lat,sat.lon],{icon:makeSatIcon(sat)});
      m.bindPopup(`<div class="popup-title sat-title">${sat.emoji} ${sat.name}</div>
        <div class="popup-row"><span>TYPE</span><span>${sat.type}</span></div>
        <div class="popup-row"><span>NORAD ID</span><span>${sat.noradId}</span></div>
        <div class="popup-row"><span>ORBIT</span><span>${orbit} · ${sat.alt} km</span></div>
        <div class="popup-row"><span>VELOCITY</span><span>${sat.vel} km/s</span></div>
        <div class="popup-row"><span>POSITION</span><span>${sat.lat.toFixed(2)}°, ${sat.lon.toFixed(2)}°</span></div>
        <div class="popup-row"><span>ETA</span><span style="color:var(--accent3)">${eta.text}</span></div>`);
      m.on('click',()=>setSelectedSat(sat)); m.addTo(map); satMarkersRef.current[sat.id]=m;
      const circle=window.L.circle([sat.lat,sat.lon],{radius:(sat.footprint||2000)*400,color:sat.color,fillColor:sat.color,fillOpacity:0.015,weight:0.3,opacity:0.1}).addTo(map);
      satOrbitLinesRef.current.push(circle);
    });
  },[filteredSats,targetCoords]);

  useEffect(()=>{
    if(!shipMapRef.current)return;
    const map=shipMapRef.current;
    Object.values(shipMarkersRef.current).forEach(m=>map.removeLayer(m)); shipMarkersRef.current={};
    filteredShips.forEach(shp=>{
      const m=window.L.marker([shp.lat,shp.lon],{icon:makeShipIcon(shp.hdg,shp.type)});
      m.bindPopup(`<div class="popup-title" style="color:#fbbf24">🚢 ${shp.name}</div>
        <div class="popup-row"><span>TYPE</span><span>${shp.type}</span></div>
        <div class="popup-row"><span>FLAG</span><span>${shp.flag}</span></div>
        <div class="popup-row"><span>ROUTE</span><span style="color:#f59e0b">${shp.origin} → ${shp.dest}</span></div>
        <div class="popup-row"><span>SPEED</span><span>${shp.spd} kts</span></div>
        <div class="popup-row"><span>HEADING</span><span>${Math.round(shp.hdg)}°</span></div>
        <div class="popup-row"><span>POSITION</span><span>${shp.lat.toFixed(2)}°, ${shp.lon.toFixed(2)}°</span></div>`);
      m.on('click',()=>setSelectedShip(shp)); m.addTo(map); shipMarkersRef.current[shp.id]=m;
    });
  },[filteredShips]);

  useEffect(()=>{
    if(!roadMapRef.current)return;
    const map=roadMapRef.current;
    Object.values(roadMarkersRef.current).forEach(m=>map.removeLayer(m)); roadMarkersRef.current={};
    filteredVehicles.forEach(veh=>{
      const m=window.L.marker([veh.lat,veh.lon],{icon:makeVehicleIcon(veh.hdg,veh.type)});
      m.bindPopup(`<div class="popup-title" style="color:#ef4444">🚙 ${veh.id}</div>
        <div class="popup-row"><span>TYPE</span><span>${veh.type}</span></div>
        <div class="popup-row"><span>COUNTRY</span><span>${veh.country}</span></div>
        <div class="popup-row"><span>STATE</span><span>${veh.state}</span></div>
        <div class="popup-row"><span>CITY</span><span style="color:#f87171">${veh.city}</span></div>
        <div class="popup-row"><span>SPEED</span><span>${veh.spd} km/h</span></div>
        <div class="popup-row"><span>HEADING</span><span>${Math.round(veh.hdg)}°</span></div>`);
      m.on('click',()=>setSelectedVehicle(veh)); m.addTo(map); roadMarkersRef.current[veh.id]=m;
    });
  },[filteredVehicles]);

  // FlyTo
  const flyToFlight = f => { setSelectedFlight(f); flightMapRef.current?.setView([f.lat,f.lon],6); };
  const flyToSat = sat => { setSelectedSat(sat); satMapRef.current?.setView([sat.lat,sat.lon],sat.alt>5000?2:4); };
  const flyToShip = shp => { setSelectedShip(shp); shipMapRef.current?.setView([shp.lat,shp.lon],5); };
  const flyToVehicle = veh => { setSelectedVehicle(veh); roadMapRef.current?.setView([veh.lat,veh.lon],11); };

  // Sat stats
  const leoCount = satData.filter(s=>s.alt<2000).length;
  const avgSatVel = satData.length>0?(satData.reduce((a,s)=>a+(s.vel||7.66),0)/satData.length).toFixed(1):0;
  let nearestSatName='—', nearestDist=Infinity;
  filteredSats.forEach(s=>{ const d=haversineKm(s.lat,s.lon,targetCoords.lat,targetCoords.lon); if(d<nearestDist){nearestDist=d;nearestSatName=s.name;} });

  // ── RENDER ──
  return h('div', { className: 'nexus-app-container' },

    // Header
    h('header', null,
      h('div', { className: 'logo' }, 'NEXUS', h('span', null, 'RADAR')),
      h('div', { className: 'nav-tabs' },
        h('button', { className: `tab-btn ${activeTab==='flight'?'active':''}`, onClick: ()=>setActiveTab('flight') }, '✈ FLIGHT RADAR'),
        h('button', { className: `tab-btn sat-tab ${activeTab==='sat'?'active':''}`, onClick: ()=>setActiveTab('sat') }, '🛰 SATELLITE TRACKER'),
        h('button', { className: `tab-btn ship-tab ${activeTab==='ship'?'active':''}`, onClick: ()=>setActiveTab('ship') }, '🚢 MARITIME RADAR'),
        h('button', { className: `tab-btn road-tab ${activeTab==='road'?'active':''}`, onClick: ()=>setActiveTab('road') }, '🚙 GROUND TRAFFIC'),
        h('button', { className: `tab-btn doc-tab ${activeTab==='about'?'active':''}`, onClick: ()=>setActiveTab('about') }, '📄 ABOUT & POLICY')
      ),
      h('div', { className: 'status-bar' },
        h('div', { className: 'status-dot green' }),
        h('span', null, `${flightData.length} AIRCRAFT`),
        h('div', { className: 'status-dot blue' }),
        h('span', null, currentTime)
      )
    ),

    // Cookie Banner
    !cookieAccepted && h('div', { className: 'cookie-banner' },
      h('div', null,
        h('strong', null, 'We value your privacy.'),
        ' We and our partners use cookies to personalize content and ads. By clicking "Accept", you agree.'
      ),
      h('button', { className: 'cookie-btn', onClick: ()=>{ localStorage.setItem('nexus_cookie_consent','true'); setCookieAccepted(true); } }, 'ACCEPT COOKIES')
    ),

    // ── FLIGHT RADAR ──
    h('div', { className: `dashboard ${activeTab==='flight'?'active':''}`, id:'dash-flight' },
      h('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'} },
        h('div', { className:'flight-layout', style:{flex:1} },
          // Sidebar
          h('div', { className:'sidebar' },
            h('div', { className:'sidebar-header' },
              'LIVE FLIGHTS',
              h('div', { style:{display:'flex',gap:'6px',alignItems:'center'} },
                h('span', { className:'flight-count' }, flightData.length),
                h('button', { className:'refresh-btn', onClick:loadFlights }, '↻ LIVE')
              )
            ),
            h('div', { className:'filter-row' },
              h('input', { type:'text', placeholder:'CALLSIGN / CITY...', value:flightSearch, onChange:e=>setFlightSearch(e.target.value) }),
              h('select', { value:countryFilter, onChange:e=>setCountryFilter(e.target.value) },
                h('option', { value:'' }, 'ALL COUNTRIES'),
                ...uniqueCountries.map(c=>h('option',{key:c,value:c},c))
              )
            ),
            h('div', { className:'flight-list' },
              ...filteredFlights.slice(0,500).map(f=>
                h('div', { key:f.icao, className:`flight-item ${selectedFlight?.icao===f.icao?'selected':''}`, onClick:()=>flyToFlight(f) },
                  h('div', { className:'fi-top' },
                    h('span', { className:'fi-callsign' }, '✈ '+f.callsign),
                    h('span', { className:'fi-alt' }, f.alt?f.alt+'m':'—')
                  ),
                  h('div', { className:'fi-route' },
                    h('span', null, f.originCity||f.originCountry||'?'),
                    h('span', { className:'arrow' }, '→'),
                    h('span', null, f.destCity||f.destCountry||'?')
                  ),
                  h('div', { className:'fi-bottom' },
                    h('span', { className:'fi-spd' }, (f.spd?f.spd+' kts':'—')+' · '+Math.round(f.hdg)+'°'),
                    h('span', { style:{fontSize:'10px',color:'var(--text-dim)'} }, f.operator||f.country||'')
                  )
                )
              )
            )
          ),
          // Map area
          h('div', { className:'map-area' },
            h('div', { className:`loading-screen ${!flightLoading?'hidden':''}` },
              h('div', { className:'loader-ring' }),
              h('div', { className:'loader-text' }, 'ACQUIRING FLIGHT DATA...')
            ),
            h('div', { id:'flight-map', style:{width:'100%',height:'100%'} }),
            h('div', { className:'map-overlay' },
              h('button', { className:'map-ctrl', onClick:()=>flightMapRef.current?.setView([20,0],2) }, '🌍 WORLD'),
              h('button', { className:'map-ctrl', onClick:()=>flightMapRef.current?.setView([54,15],4) }, '🗺 EUROPE'),
              h('button', { className:'map-ctrl', onClick:()=>flightMapRef.current?.setView([38,-97],3) }, '🗺 N.AMERICA'),
              h('button', { className:'map-ctrl', onClick:()=>flightMapRef.current?.setView([23,82],4) }, '🗺 ASIA'),
              h('button', { className:'map-ctrl', onClick:()=>flightMapRef.current?.setView([-10,25],3) }, '🗺 AFRICA'),
              h('button', { className:'map-ctrl', onClick:()=>flightMapRef.current?.setView([-25,133],4) }, '🗺 OCEANIA')
            ),
            selectedFlight && h('div', { className:'info-panel visible' },
              h('div',{className:'info-field'},h('label',null,'CALLSIGN'),h('span',null,selectedFlight.callsign)),
              h('div',{className:'info-field'},h('label',null,'ROUTE'),h('span',{className:'route-span'},`${selectedFlight.originCity||'?'}→${selectedFlight.destCity||'?'}`)),
              h('div',{className:'info-field'},h('label',null,'ALTITUDE'),h('span',null,selectedFlight.alt?selectedFlight.alt+'m':'N/A')),
              h('div',{className:'info-field'},h('label',null,'SPEED'),h('span',null,selectedFlight.spd?selectedFlight.spd+' kts':'N/A')),
              h('div',{className:'info-field'},h('label',null,'HEADING'),h('span',null,Math.round(selectedFlight.hdg)+'°')),
              h('div',{className:'info-field'},h('label',null,'OPERATOR'),h('span',null,selectedFlight.operator||selectedFlight.country||'N/A'))
            )
          )
        ),
        h('div', { className:'ticker' },
          h('div', { className:'ticker-inner' },
            ...[...flightData.slice(0,40),...flightData.slice(0,40)].map((f,i)=>
              h('span',{key:i,className:'ticker-item'},h('b',null,f.callsign),` ${f.originCity||'?'} → ${f.destCity||'?'} · ${f.alt||'?'}m · ${f.spd||'?'}kts`)
            )
          )
        )
      )
    ),

    // ── SATELLITE TRACKER ──
    h('div', { className:`dashboard ${activeTab==='sat'?'active':''}`, id:'dash-sat' },
      h('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'} },
        h('div', { className:'sat-layout', style:{flex:1} },
          h('div', { className:'sat-map-area' },
            h('div', { className:`loading-screen ${!satLoading?'hidden':''}` },
              h('div', { className:'loader-ring', style:{borderTopColor:'var(--accent2)'} }),
              h('div', { className:'loader-text', style:{color:'var(--accent2)'} }, 'TRACKING ORBITAL OBJECTS...')
            ),
            h('div', { id:'sat-map', style:{width:'100%',height:'100%'} }),
            selectedSat && (()=>{
              const eta=calcETA(selectedSat,targetCoords);
              const orbit=selectedSat.alt>30000?'GEO':selectedSat.alt>5000?'MEO':'LEO';
              return h('div', { className:'sat-detail visible' },
                h('h3', null, selectedSat.emoji+' '+selectedSat.name),
                h('div', { className:'sat-detail-grid' },
                  h('div',{className:'sdf'},h('label',null,'LATITUDE'),h('span',null,selectedSat.lat.toFixed(3)+'°')),
                  h('div',{className:'sdf'},h('label',null,'LONGITUDE'),h('span',null,selectedSat.lon.toFixed(3)+'°')),
                  h('div',{className:'sdf'},h('label',null,'ALTITUDE'),h('span',null,selectedSat.alt+' km')),
                  h('div',{className:'sdf'},h('label',null,'VELOCITY'),h('span',null,selectedSat.vel+' km/s')),
                  h('div',{className:'sdf'},h('label',null,'ORBIT CLASS'),h('span',null,orbit)),
                  h('div',{className:'sdf'},h('label',null,'ETA TO TARGET'),h('span',{style:{color:'var(--accent3)'}},eta.text))
                )
              );
            })()
          ),
          h('div', { className:'sat-sidebar' },
            h('div', { className:'sat-header' },
              h('span', null, 'SATELLITES ', h('span',{style:{fontSize:'11px',background:'rgba(0,255,136,0.2)',padding:'1px 8px',border:'1px solid rgba(0,255,136,0.3)'}},satData.length)),
              h('button', { className:'refresh-btn sat', onClick:loadSatellites }, '↻ REFRESH')
            ),
            h('div', { className:'sat-filters' },
              h('div', { style:{display:'flex',gap:'6px'} },
                h('div', { style:{flex:1} },
                  h('label', null, 'TARGET COUNTRY (ETA)'),
                  h('select', { value:targetCountryVal, onChange:e=>setTargetCountryVal(e.target.value) },
                    h('option',{value:'20,77'},'🇮🇳 India'),
                    h('option',{value:'17.4,78.5'},'📍 Hyderabad'),
                    h('option',{value:'1.3,103.8'},'🇸🇬 Singapore'),
                    h('option',{value:'39,35'},'🇹🇷 Turkey'),
                    h('option',{value:'51,10'},'🇩🇪 Germany'),
                    h('option',{value:'56,-3'},'🇬🇧 UK'),
                    h('option',{value:'46,2'},'🇫🇷 France'),
                    h('option',{value:'38,-97'},'🇺🇸 USA'),
                    h('option',{value:'37,127'},'🇰🇷 South Korea'),
                    h('option',{value:'36,138'},'🇯🇵 Japan'),
                    h('option',{value:'35,105'},'🇨🇳 China'),
                    h('option',{value:'-14,-51'},'🇧🇷 Brazil'),
                    h('option',{value:'61,105'},'🇷🇺 Russia'),
                    h('option',{value:'-25,133'},'🇦🇺 Australia')
                  )
                ),
                h('div', { style:{flex:1} },
                  h('label', null, 'FILTER BY TYPE'),
                  h('select', { value:satTypeFilter, onChange:e=>setSatTypeFilter(e.target.value) },
                    h('option',{value:''},'ALL TYPES'),
                    h('option',{value:'SPACE STATION'},'SPACE STATION'),
                    h('option',{value:'WEATHER'},'WEATHER'),
                    h('option',{value:'EARTH OBS'},'EARTH OBS'),
                    h('option',{value:'NAVIGATION'},'NAVIGATION'),
                    h('option',{value:'COMMS'},'COMMS'),
                    h('option',{value:'TELESCOPE'},'TELESCOPE'),
                    h('option',{value:'MILITARY'},'MILITARY'),
                    h('option',{value:'SCIENCE'},'SCIENCE')
                  )
                )
              ),
              h('input', { type:'text', placeholder:'SEARCH SATELLITE NAME...', value:satSearch, onChange:e=>setSatSearch(e.target.value) })
            ),
            h('div', { className:'sat-stats' },
              h('div',{className:'stat-box'},h('label',null,'TRACKED'),h('span',null,satData.length)),
              h('div',{className:'stat-box'},h('label',null,'LEO SATS'),h('span',null,leoCount)),
              h('div',{className:'stat-box'},h('label',null,'NEAREST'),h('span',{style:{fontSize:'10px',color:'var(--accent3)'}},nearestSatName)),
              h('div',{className:'stat-box'},h('label',null,'AVG SPEED'),h('span',null,avgSatVel+' km/s'))
            ),
            h('div', { className:'sat-list' },
              ...filteredSats.slice(0,500).map(sat=>{
                const eta=calcETA(sat,targetCoords);
                return h('div',{key:sat.id,className:`sat-item ${selectedSat?.id===sat.id?'selected':''}`,onClick:()=>flyToSat(sat)},
                  h('div',{style:{display:'flex',alignItems:'center',gap:'5px'}},
                    h('span',{className:'type-dot',style:{background:sat.color,boxShadow:`0 0 4px ${sat.color}`}}),
                    h('span',{className:'si-name'},sat.name)
                  ),
                  h('div',{className:'si-type'},`${sat.type} · ${sat.alt>30000?'GEO':sat.alt>5000?'MEO':'LEO'} · ${sat.alt} km`),
                  h('div',{className:'si-coords'},`LAT:${sat.lat.toFixed(1)}° LON:${sat.lon.toFixed(1)}° · ${sat.vel}km/s`),
                  h('div',{className:'si-eta'},h('span',{className:`eta-badge eta-${eta.badge}`},'⏱ '+eta.text))
                );
              })
            )
          )
        ),
        h('div',{className:'ticker'},
          h('div',{className:'ticker-inner'},
            ...[...satData.slice(0,40),...satData.slice(0,40)].map((s,i)=>{
              const eta=calcETA(s,targetCoords);
              return h('span',{key:i,className:'ticker-item'},h('b',null,s.name),` ${s.type} · ${s.alt}km · ${s.vel}km/s · ETA:${eta.text}`);
            })
          )
        )
      )
    ),

    // ── MARITIME RADAR ──
    h('div', { className:`dashboard ${activeTab==='ship'?'active':''}`, id:'dash-ship' },
      h('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'} },
        h('div', { className:'flight-layout', style:{flex:1} },
          h('div', { className:'sidebar' },
            h('div', { className:'sidebar-header', style:{color:'var(--accent-ship)'} },
              'LIVE VESSELS',
              h('div',{style:{display:'flex',gap:'6px',alignItems:'center'}},
                h('span',{className:'flight-count',style:{background:'rgba(251,191,36,0.15)',borderColor:'rgba(251,191,36,0.3)',color:'var(--accent-ship)'}},shipData.length),
                h('button',{className:'refresh-btn ship',onClick:loadShips},'↻ SCAN')
              )
            ),
            h('div',{className:'filter-row'},
              h('input',{type:'text',placeholder:'VESSEL / ROUTE...',value:shipSearch,onChange:e=>setShipSearch(e.target.value),style:{background:'rgba(251,191,36,0.05)'}}),
              h('select',{value:shipTypeFilter,onChange:e=>setShipTypeFilter(e.target.value),style:{background:'rgba(251,191,36,0.05)'}},
                h('option',{value:''},'ALL TYPES'),
                ...SHIP_TYPES.map(t=>h('option',{key:t,value:t},t))
              )
            ),
            h('div',{className:'flight-list'},
              ...filteredShips.slice(0,400).map(shp=>
                h('div',{key:shp.id,className:`flight-item ship-item ${selectedShip?.id===shp.id?'selected':''}`,onClick:()=>flyToShip(shp)},
                  h('div',{className:'fi-top'},
                    h('span',{className:'fi-callsign',style:{color:'var(--accent-ship)'}},'🚢 '+shp.name),
                    h('span',{className:'fi-alt',style:{color:'var(--text-dim)'}},shp.type)
                  ),
                  h('div',{className:'fi-route'},
                    h('span',null,shp.origin),
                    h('span',{className:'arrow',style:{color:'#f59e0b'}},'→'),
                    h('span',null,shp.dest)
                  ),
                  h('div',{className:'fi-bottom'},
                    h('span',{className:'fi-spd'},shp.spd+' kts · '+Math.round(shp.hdg)+'°'),
                    h('span',{style:{fontSize:'10px',color:'var(--text-dim)'}}, 'Flag: '+shp.flag)
                  )
                )
              )
            )
          ),
          h('div',{className:'map-area'},
            h('div',{className:`loading-screen ${!shipLoading?'hidden':''}`},
              h('div',{className:'loader-ring',style:{borderTopColor:'var(--accent-ship)'}}),
              h('div',{className:'loader-text',style:{color:'var(--accent-ship)'}},'ESTABLISHING MARITIME LINK...')
            ),
            h('div',{id:'ship-map',style:{width:'100%',height:'100%'}}),
            h('div',{className:'map-overlay'},
              h('button',{className:'map-ctrl ship',onClick:()=>shipMapRef.current?.setView([20,0],2)},'🌍 WORLD'),
              h('button',{className:'map-ctrl ship',onClick:()=>shipMapRef.current?.setView([25,-75],4)},'🗺 ATLANTIC'),
              h('button',{className:'map-ctrl ship',onClick:()=>shipMapRef.current?.setView([10,140],3)},'🗺 PACIFIC'),
              h('button',{className:'map-ctrl ship',onClick:()=>shipMapRef.current?.setView([-10,70],4)},'🗺 INDIAN OC.')
            ),
            selectedShip && h('div',{className:'info-panel visible',style:{borderColor:'var(--accent-ship)'}},
              h('div',{className:'info-field'},h('label',null,'VESSEL'),h('span',{style:{color:'var(--accent-ship)'}},selectedShip.name)),
              h('div',{className:'info-field'},h('label',null,'ROUTE'),h('span',{className:'route-span',style:{color:'#f59e0b'}},`${selectedShip.origin}→${selectedShip.dest}`)),
              h('div',{className:'info-field'},h('label',null,'TYPE'),h('span',null,selectedShip.type)),
              h('div',{className:'info-field'},h('label',null,'SPEED'),h('span',null,selectedShip.spd+' kts')),
              h('div',{className:'info-field'},h('label',null,'HEADING'),h('span',null,Math.round(selectedShip.hdg)+'°')),
              h('div',{className:'info-field'},h('label',null,'REGISTRY'),h('span',null,selectedShip.flag))
            )
          )
        ),
        h('div',{className:'ticker'},
          h('div',{className:'ticker-inner'},
            ...[...shipData.slice(0,40),...shipData.slice(0,40)].map((shp,i)=>
              h('span',{key:i,className:'ticker-item'},h('b',{style:{color:'var(--accent-ship)'}},shp.name),` ${shp.type} · ${shp.origin} → ${shp.dest} · ${shp.spd}kts`)
            )
          )
        )
      )
    ),

    // ── GROUND TRAFFIC ──
    h('div', { className:`dashboard ${activeTab==='road'?'active':''}`, id:'dash-road' },
      h('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'} },
        h('div', { className:'flight-layout', style:{flex:1} },
          h('div', { className:'sidebar' },
            h('div', { className:'sidebar-header', style:{color:'var(--accent-road)'} },
              'LIVE GROUND TRAFFIC',
              h('div',{style:{display:'flex',gap:'6px',alignItems:'center'}},
                h('span',{className:'flight-count',style:{background:'rgba(239,68,68,0.15)',borderColor:'rgba(239,68,68,0.3)',color:'var(--accent-road)'}},filteredVehicles.length),
                h('button',{className:'refresh-btn road',onClick:loadVehicles},'↻ SCAN')
              )
            ),
            h('div',{className:'filter-row',style:{flexDirection:'column',gap:'6px',padding:'12px 10px'}},
              h('input',{type:'text',placeholder:'SEARCH VEHICLE ID/TYPE...',value:vehicleSearch,onChange:e=>setVehicleSearch(e.target.value),style:{background:'rgba(239,68,68,0.05)'}}),
              h('select',{value:vehicleCountry,onChange:e=>{setVehicleCountry(e.target.value);setVehicleState('');setVehicleCity('');},style:{background:'rgba(239,68,68,0.05)'}},
                h('option',{value:''},'1. SELECT COUNTRY (ALL)'),
                ...availableRoadCountries.map(c=>h('option',{key:c,value:c},c))
              ),
              h('select',{value:vehicleState,onChange:e=>{setVehicleState(e.target.value);setVehicleCity('');},style:{background:'rgba(239,68,68,0.05)'},disabled:!vehicleCountry},
                h('option',{value:''},'2. SELECT STATE/REGION (ALL)'),
                ...availableRoadStates.map(s=>h('option',{key:s,value:s},s))
              ),
              h('select',{value:vehicleCity,onChange:e=>setVehicleCity(e.target.value),style:{background:'rgba(239,68,68,0.05)'},disabled:!vehicleState},
                h('option',{value:''},'3. SELECT LOCAL CITY (ALL)'),
                ...availableRoadCities.map(c=>h('option',{key:c,value:c},c))
              )
            ),
            h('div',{className:'flight-list'},
              ...filteredVehicles.slice(0,400).map(veh=>
                h('div',{key:veh.id,className:`flight-item road-item ${selectedVehicle?.id===veh.id?'selected':''}`,onClick:()=>flyToVehicle(veh)},
                  h('div',{className:'fi-top'},
                    h('span',{className:'fi-callsign',style:{color:'var(--accent-road)'}},'🚙 '+veh.id),
                    h('span',{className:'fi-alt',style:{color:'var(--text-dim)'}},veh.type)
                  ),
                  h('div',{className:'fi-route'},
                    h('span',null,veh.city),
                    h('span',{className:'arrow',style:{color:'#ef4444'}},','),
                    h('span',null,veh.state)
                  ),
                  h('div',{className:'fi-bottom'},
                    h('span',{className:'fi-spd'},veh.spd+' km/h · '+Math.round(veh.hdg)+'°'),
                    h('span',{style:{fontSize:'10px',color:'var(--text-dim)'}},veh.country)
                  )
                )
              )
            )
          ),
          h('div',{className:'map-area'},
            h('div',{className:`loading-screen ${!vehicleLoading?'hidden':''}`},
              h('div',{className:'loader-ring',style:{borderTopColor:'var(--accent-road)'}}),
              h('div',{className:'loader-text',style:{color:'var(--accent-road)'}},'INITIALIZING GROUND SENSORS...')
            ),
            h('div',{id:'road-map',style:{width:'100%',height:'100%'}}),
            h('div',{className:'map-overlay'},
              h('button',{className:'map-ctrl road',onClick:()=>roadMapRef.current?.setView([20,0],2)},'🌍 WORLD'),
              h('button',{className:'map-ctrl road',onClick:()=>roadMapRef.current?.setView([39,-98],4)},'🗺 USA'),
              h('button',{className:'map-ctrl road',onClick:()=>roadMapRef.current?.setView([22,79],5)},'🗺 INDIA'),
              h('button',{className:'map-ctrl road',onClick:()=>roadMapRef.current?.setView([54,-2],5)},'🗺 UK')
            ),
            selectedVehicle && h('div',{className:'info-panel visible',style:{borderColor:'var(--accent-road)'}},
              h('div',{className:'info-field'},h('label',null,'VEHICLE ID'),h('span',{style:{color:'var(--accent-road)'}},selectedVehicle.id)),
              h('div',{className:'info-field'},h('label',null,'LOCATION'),h('span',{className:'route-span',style:{color:'#f87171'}},`${selectedVehicle.city}, ${selectedVehicle.state}`)),
              h('div',{className:'info-field'},h('label',null,'TYPE'),h('span',null,selectedVehicle.type)),
              h('div',{className:'info-field'},h('label',null,'SPEED'),h('span',null,selectedVehicle.spd+' km/h')),
              h('div',{className:'info-field'},h('label',null,'HEADING'),h('span',null,Math.round(selectedVehicle.hdg)+'°')),
              h('div',{className:'info-field'},h('label',null,'COUNTRY'),h('span',null,selectedVehicle.country))
            )
          )
        ),
        h('div',{className:'ticker'},
          h('div',{className:'ticker-inner'},
            ...[...filteredVehicles.slice(0,40),...filteredVehicles.slice(0,40)].map((veh,i)=>
              h('span',{key:i,className:'ticker-item'},h('b',{style:{color:'var(--accent-road)'}},veh.id),` ${veh.type} · ${veh.city}, ${veh.state} (${veh.country}) · ${veh.spd}km/h`)
            )
          )
        )
      )
    ),

    // ── ABOUT & POLICY ──
    h('div', { className:`dashboard ${activeTab==='about'?'active':''}`, style:{background:'var(--panel)',overflowY:'auto'} },
      h('div', { className:'about-container' },
        h('h1', { style:{color:'var(--accent-bright)',marginBottom:'20px',fontFamily:"'Syne', sans-serif"} }, 'ABOUT NEXUS RADAR'),
        h('p', null, 'Welcome to Nexus Radar, your comprehensive global tracking utility. This application provides simulated and live data streams for educational, demonstrational, and entertainment purposes.'),
        h('h2', { style:{marginTop:'20px',color:'var(--text)',borderBottom:'1px solid var(--border)',paddingBottom:'10px'} }, 'Terms of Service & Privacy Policy'),
        h('p', null, h('strong', null, '1. Data Accuracy:'), ' The tracking data provided is a mix of live open-source feeds (OpenSky Network) and procedural simulation. Do not use for actual navigation or professional aviation.'),
        h('p', null, h('strong', null, '2. Third-Party Advertisements:'), ' We use Google AdSense to serve ads. These companies may use non-identifying information about your visits to provide interest-based advertising.'),
        h('p', null, h('strong', null, '3. Cookie Usage (GDPR/CCPA):'), ' Google uses cookies to serve ads on our site. Users may opt-out of personalized advertising by visiting Google Ads Settings.'),
        h('p', null, h('strong', null, '4. User Privacy:'), ' We do not actively collect or sell personally identifiable information beyond what is handled by our third-party partners.'),
        h('div', { style:{marginTop:'40px',padding:'20px',background:'rgba(0,0,0,0.3)',border:'1px dashed var(--border)'} },
          h('h3', { style:{color:'var(--text-dim)',textAlign:'center'} }, 'In-Content Ad Slot'),
          h(AdSenseWidget, { slotId:'9988776655', style:{minHeight:'150px',marginTop:'10px'} })
        )
      )
    )
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App, null));
