// ===== NEXUS RADAR — Static Data & Generator Functions =====

const ROUTE_DB = [
  ['Mumbai','India',18.9,72.8,'London','UK',51.5,-0.1,'Air India'],
  ['Delhi','India',28.6,77.2,'Singapore','Singapore',1.3,103.8,'IndiGo'],
  ['Bangalore','India',12.9,77.6,'Dubai','UAE',25.2,55.3,'Emirates'],
  ['Hyderabad','India',17.4,78.5,'Frankfurt','Germany',50.0,8.6,'Lufthansa'],
  ['Chennai','India',13.0,80.2,'Kuala Lumpur','Malaysia',3.1,101.7,'AirAsia'],
  ['Kolkata','India',22.6,88.4,'Bangkok','Thailand',13.7,100.5,'Thai Airways'],
  ['Delhi','India',28.6,77.2,'London','UK',51.5,-0.1,'British Airways'],
  ['Mumbai','India',18.9,72.8,'New York','USA',40.7,-74.0,'Air India'],
  ['Bangalore','India',12.9,77.6,'Singapore','Singapore',1.3,103.8,'Singapore Airlines'],
  ['Hyderabad','India',17.4,78.5,'Singapore','Singapore',1.3,103.8,'IndiGo'],
  ['Delhi','India',28.6,77.2,'Tokyo','Japan',35.7,139.7,'ANA'],
  ['Mumbai','India',18.9,72.8,'Toronto','Canada',43.7,-79.6,'Air Canada'],
  ['London','UK',51.5,-0.1,'New York','USA',40.7,-74.0,'British Airways'],
  ['London','UK',51.5,-0.1,'Dubai','UAE',25.2,55.3,'Emirates'],
  ['London','UK',51.5,-0.1,'Singapore','Singapore',1.3,103.8,'Singapore Airlines'],
  ['Paris','France',48.8,2.3,'Montreal','Canada',45.5,-73.6,'Air France'],
  ['Paris','France',48.8,2.3,'New York','USA',40.7,-74.0,'Air France'],
  ['Frankfurt','Germany',50.0,8.6,'Tokyo','Japan',35.7,139.7,'Lufthansa'],
  ['Frankfurt','Germany',50.0,8.6,'Singapore','Singapore',1.3,103.8,'Lufthansa'],
  ['Amsterdam','Netherlands',52.3,4.9,'Kuala Lumpur','Malaysia',3.1,101.7,'KLM'],
  ['Amsterdam','Netherlands',52.3,4.9,'New York','USA',40.7,-74.0,'KLM'],
  ['Madrid','Spain',40.4,-3.7,'Buenos Aires','Argentina',-34.6,-58.4,'Iberia'],
  ['Rome','Italy',41.9,12.5,'New York','USA',40.7,-74.0,'ITA Airways'],
  ['Dubai','UAE',25.2,55.3,'London','UK',51.5,-0.1,'Emirates'],
  ['Dubai','UAE',25.2,55.3,'Sydney','Australia',-33.9,151.2,'Emirates'],
  ['Dubai','UAE',25.2,55.3,'New York','USA',40.7,-74.0,'Emirates'],
  ['Dubai','UAE',25.2,55.3,'Mumbai','India',18.9,72.8,'Emirates'],
  ['Singapore','Singapore',1.3,103.8,'London','UK',51.5,-0.1,'Singapore Airlines'],
  ['Singapore','Singapore',1.3,103.8,'Sydney','Australia',-33.9,151.2,'Singapore Airlines'],
  ['Singapore','Singapore',1.3,103.8,'Los Angeles','USA',34.1,-118.2,'Singapore Airlines'],
  ['Tokyo','Japan',35.7,139.7,'Los Angeles','USA',34.1,-118.2,'ANA'],
  ['Tokyo','Japan',35.7,139.7,'San Francisco','USA',37.6,-122.4,'JAL'],
  ['Tokyo','Japan',35.7,139.7,'London','UK',51.5,-0.1,'JAL'],
  ['Seoul','South Korea',37.6,127.0,'New York','USA',40.7,-74.0,'Korean Air'],
  ['Seoul','South Korea',37.6,127.0,'London','UK',51.5,-0.1,'Asiana Airlines'],
  ['Hong Kong','China',22.3,114.2,'London','UK',51.5,-0.1,'Cathay Pacific'],
  ['Hong Kong','China',22.3,114.2,'New York','USA',40.7,-74.0,'Cathay Pacific'],
  ['Beijing','China',39.9,116.4,'Frankfurt','Germany',50.0,8.6,'Air China'],
  ['Shanghai','China',31.2,121.5,'Los Angeles','USA',34.1,-118.2,'China Eastern'],
  ['Guangzhou','China',23.2,113.3,'Sydney','Australia',-33.9,151.2,'China Southern'],
  ['Sydney','Australia',-33.9,151.2,'Dallas','USA',32.9,-97.0,'Qantas'],
  ['Sydney','Australia',-33.9,151.2,'London','UK',51.5,-0.1,'Qantas'],
  ['Melbourne','Australia',-37.8,144.9,'Bali','Indonesia',-8.7,115.2,'Virgin Australia'],
  ['New York','USA',40.7,-74.0,'London','UK',51.5,-0.1,'United Airlines'],
  ['New York','USA',40.7,-74.0,'Paris','France',48.8,2.3,'Delta Air Lines'],
  ['New York','USA',40.7,-74.0,'Tokyo','Japan',35.7,139.7,'American Airlines'],
  ['Los Angeles','USA',34.1,-118.2,'Tokyo','Japan',35.7,139.7,'American Airlines'],
  ['Los Angeles','USA',34.1,-118.2,'Sydney','Australia',-33.9,151.2,'Qantas'],
  ['Chicago','USA',41.9,-87.6,'London','UK',51.5,-0.1,'United Airlines'],
  ['Miami','USA',25.8,-80.3,'Madrid','Spain',40.4,-3.7,'Iberia'],
  ['San Francisco','USA',37.6,-122.4,'Singapore','Singapore',1.3,103.8,'Singapore Airlines']
];

const PFXS = ['UAL','DAL','AAL','BAW','AFR','DLH','EZY','EK','QTR','SIA','QFA','THA','AIC','IGO','THY','AFL','KAL','CPA','ANA','JAL','MAS','GIA','ETD','SVA','ACA','AMX','IBE','KLM','SAS','VOZ','RYR','VIR','AZA'];

const ALL_SATELLITES = [
  {id:'ISS',name:'Intl. Space Station',type:'SPACE STATION',noradId:25544,color:'#00ff88',emoji:'🛸'},
  {id:'TIANGONG',name:'Tiangong (CSS)',type:'SPACE STATION',noradId:48274,color:'#f87171',emoji:'🛸'},
  {id:'HST',name:'Hubble Space Telescope',type:'TELESCOPE',noradId:20580,color:'#a855f7',emoji:'🔭'},
  {id:'CHANDRA',name:'Chandra X-Ray',type:'TELESCOPE',noradId:25867,color:'#c084fc',emoji:'🔭'},
  {id:'FERMI',name:'Fermi Gamma-Ray',type:'TELESCOPE',noradId:33053,color:'#e879f9',emoji:'🔭'},
  {id:'SPEKTR_RG',name:'Spektr-RG',type:'TELESCOPE',noradId:44432,color:'#d8b4fe',emoji:'🔭'},
  {id:'NOAA15',name:'NOAA-15',type:'WEATHER',noradId:25338,color:'#38bdf8',emoji:'🌤'},
  {id:'NOAA18',name:'NOAA-18',type:'WEATHER',noradId:28654,color:'#38bdf8',emoji:'🌤'},
  {id:'NOAA19',name:'NOAA-19',type:'WEATHER',noradId:33591,color:'#38bdf8',emoji:'🌤'},
  {id:'NOAA20',name:'NOAA-20 (JPSS-1)',type:'WEATHER',noradId:43013,color:'#38bdf8',emoji:'🌤'},
  {id:'GOES16',name:'GOES-16',type:'WEATHER',noradId:41866,color:'#fb923c',emoji:'⛅'},
  {id:'GOES17',name:'GOES-17',type:'WEATHER',noradId:43226,color:'#fb923c',emoji:'⛅'},
  {id:'GOES18',name:'GOES-18',type:'WEATHER',noradId:51850,color:'#fb923c',emoji:'⛅'},
  {id:'METOPA',name:'MetOp-A',type:'WEATHER',noradId:29499,color:'#60a5fa',emoji:'🌤'},
  {id:'METOPB',name:'MetOp-B',type:'WEATHER',noradId:38771,color:'#60a5fa',emoji:'🌤'},
  {id:'METOPC',name:'MetOp-C',type:'WEATHER',noradId:43689,color:'#60a5fa',emoji:'🌤'},
  {id:'MSG4',name:'Meteosat-11',type:'WEATHER',noradId:41732,color:'#fde68a',emoji:'🌍'},
  {id:'INSAT3D',name:'INSAT-3D',type:'WEATHER',noradId:39216,color:'#fbbf24',emoji:'🌤'},
  {id:'INSAT3DR',name:'INSAT-3DR',type:'WEATHER',noradId:41752,color:'#fbbf24',emoji:'🌤'},
  {id:'FY4A',name:'Fengyun-4A',type:'WEATHER',noradId:41882,color:'#f472b6',emoji:'🌤'},
  {id:'FY3D',name:'Fengyun-3D',type:'WEATHER',noradId:43010,color:'#ec4899',emoji:'🌤'},
  {id:'TERRA',name:'Terra (EOS AM-1)',type:'EARTH OBS',noradId:25994,color:'#22d3ee',emoji:'🌍'},
  {id:'AQUA',name:'Aqua (EOS PM-1)',type:'EARTH OBS',noradId:27424,color:'#22d3ee',emoji:'🌊'},
  {id:'S1A',name:'Sentinel-1A',type:'EARTH OBS',noradId:39634,color:'#34d399',emoji:'🛰'},
  {id:'S1B',name:'Sentinel-1B',type:'EARTH OBS',noradId:41456,color:'#34d399',emoji:'🛰'},
  {id:'S2A',name:'Sentinel-2A',type:'EARTH OBS',noradId:40697,color:'#34d399',emoji:'🛰'},
  {id:'S2B',name:'Sentinel-2B',type:'EARTH OBS',noradId:42063,color:'#34d399',emoji:'🛰'},
  {id:'S3A',name:'Sentinel-3A',type:'EARTH OBS',noradId:41335,color:'#34d399',emoji:'🛰'},
  {id:'S3B',name:'Sentinel-3B',type:'EARTH OBS',noradId:43437,color:'#34d399',emoji:'🛰'},
  {id:'S5P',name:'Sentinel-5P',type:'EARTH OBS',noradId:42969,color:'#34d399',emoji:'🛰'},
  {id:'S6A',name:'Sentinel-6A',type:'EARTH OBS',noradId:46984,color:'#34d399',emoji:'🛰'},
  {id:'L8',name:'Landsat 8',type:'EARTH OBS',noradId:39084,color:'#4ade80',emoji:'🛰'},
  {id:'L9',name:'Landsat 9',type:'EARTH OBS',noradId:49260,color:'#4ade80',emoji:'🛰'},
  {id:'SPOT6',name:'SPOT-6',type:'EARTH OBS',noradId:38755,color:'#a7f3d0',emoji:'🛰'},
  {id:'SPOT7',name:'SPOT-7',type:'EARTH OBS',noradId:40053,color:'#a7f3d0',emoji:'🛰'},
  {id:'WV3',name:'WorldView-3',type:'EARTH OBS',noradId:40115,color:'#6ee7b7',emoji:'🛰'},
  {id:'WV4',name:'WorldView-4',type:'EARTH OBS',noradId:41848,color:'#6ee7b7',emoji:'🛰'},
  {id:'PL1A',name:'Pleiades-1A',type:'EARTH OBS',noradId:38012,color:'#86efac',emoji:'🛰'},
  {id:'PL1B',name:'Pleiades-1B',type:'EARTH OBS',noradId:39019,color:'#86efac',emoji:'🛰'},
  {id:'PNB1',name:'Pleiades Neo-3',type:'EARTH OBS',noradId:49002,color:'#bbf7d0',emoji:'🛰'},
  {id:'CS2_EARTH',name:'Cartosat-2',type:'EARTH OBS',noradId:28922,color:'#d9f99d',emoji:'🛰'},
  {id:'CS3',name:'Cartosat-3',type:'EARTH OBS',noradId:44804,color:'#d9f99d',emoji:'🛰'},
  {id:'RS2',name:'ResourceSat-2',type:'EARTH OBS',noradId:37387,color:'#bef264',emoji:'🛰'},
  {id:'RS2A',name:'ResourceSat-2A',type:'EARTH OBS',noradId:41877,color:'#bef264',emoji:'🛰'},
  {id:'RISAT2B',name:'RISAT-2BR1',type:'EARTH OBS',noradId:44233,color:'#a3e635',emoji:'🛰'},
  {id:'ALOS2',name:'ALOS-2',type:'EARTH OBS',noradId:39766,color:'#65a30d',emoji:'🛰'},
  {id:'COSMO1',name:'COSMO-SkyMed 1',type:'EARTH OBS',noradId:31598,color:'#4d7c0f',emoji:'🛰'},
  {id:'COSMO4',name:'COSMO-SkyMed 4',type:'EARTH OBS',noradId:36797,color:'#4d7c0f',emoji:'🛰'},
  {id:'KOMPSAT5',name:'KOMPSAT-5',type:'EARTH OBS',noradId:39227,color:'#84cc16',emoji:'🛰'},
  {id:'GPS2R1',name:'GPS IIR-1',type:'NAVIGATION',noradId:22877,color:'#fbbf24',emoji:'📡'},
  {id:'GPS2R7',name:'GPS IIR-7',type:'NAVIGATION',noradId:26360,color:'#fbbf24',emoji:'📡'},
  {id:'GPS2F1',name:'GPS IIF-1',type:'NAVIGATION',noradId:36585,color:'#fbbf24',emoji:'📡'},
  {id:'GPS3SV01',name:'GPS III SV01',type:'NAVIGATION',noradId:43873,color:'#fde68a',emoji:'📡'},
  {id:'GPS3SV05',name:'GPS III SV05',type:'NAVIGATION',noradId:48859,color:'#fde68a',emoji:'📡'},
  {id:'GAL01',name:'Galileo GSAT-0101',type:'NAVIGATION',noradId:37846,color:'#fcd34d',emoji:'📡'},
  {id:'GAL05',name:'Galileo GSAT-0201',type:'NAVIGATION',noradId:40128,color:'#fcd34d',emoji:'📡'},
  {id:'GAL13',name:'Galileo GSAT-0209',type:'NAVIGATION',noradId:41859,color:'#fcd34d',emoji:'📡'},
  {id:'GLO1',name:'GLONASS-M 701',type:'NAVIGATION',noradId:28920,color:'#f97316',emoji:'📡'},
  {id:'GLO2',name:'GLONASS-M 857',type:'NAVIGATION',noradId:41330,color:'#f97316',emoji:'📡'},
  {id:'BDS3',name:'BeiDou-3 M1',type:'NAVIGATION',noradId:43001,color:'#fb923c',emoji:'📡'},
  {id:'BDS4',name:'BeiDou-3 M2',type:'NAVIGATION',noradId:43002,color:'#fb923c',emoji:'📡'},
  {id:'BDS_G3',name:'BeiDou-3 G3 (GEO)',type:'NAVIGATION',noradId:44709,color:'#fdba74',emoji:'📡'},
  {id:'IRNSS1A',name:'NavIC IRNSS-1A',type:'NAVIGATION',noradId:39199,color:'#fef08a',emoji:'📡'},
  {id:'IRNSS1B',name:'NavIC IRNSS-1B',type:'NAVIGATION',noradId:39635,color:'#fef08a',emoji:'📡'},
  {id:'IRNSS1I',name:'NavIC IRNSS-1I',type:'NAVIGATION',noradId:43286,color:'#fef08a',emoji:'📡'},
  {id:'QZSS1',name:'QZSS Michibiki-1',type:'NAVIGATION',noradId:37158,color:'#fef9c3',emoji:'📡'},
  {id:'INT1',name:'Intelsat 901',type:'COMMS',noradId:26824,color:'#818cf8',emoji:'📶'},
  {id:'INT18',name:'Intelsat 18',type:'COMMS',noradId:37834,color:'#818cf8',emoji:'📶'},
  {id:'AS1N',name:'Astra 1N',type:'COMMS',noradId:37775,color:'#a5b4fc',emoji:'📶'},
  {id:'AS2E',name:'Astra 2E',type:'COMMS',noradId:39127,color:'#a5b4fc',emoji:'📶'},
  {id:'ET7A',name:'Eutelsat 7A',type:'COMMS',noradId:28966,color:'#c7d2fe',emoji:'📶'},
  {id:'ET9B',name:'Eutelsat 9B',type:'COMMS',noradId:41036,color:'#c7d2fe',emoji:'📶'},
  {id:'ET36B',name:'Eutelsat 36B',type:'COMMS',noradId:34694,color:'#c7d2fe',emoji:'📶'},
  {id:'HB13G',name:'Hotbird 13G',type:'COMMS',noradId:50443,color:'#ddd6fe',emoji:'📶'},
  {id:'SES9',name:'SES-9',type:'COMMS',noradId:41380,color:'#6d28d9',emoji:'📶'},
  {id:'SES12',name:'SES-12',type:'COMMS',noradId:43488,color:'#6d28d9',emoji:'📶'},
  {id:'SES17',name:'SES-17',type:'COMMS',noradId:49260,color:'#6d28d9',emoji:'📶'},
  {id:'GSAT29',name:'GSAT-29 (India)',type:'COMMS',noradId:43698,color:'#7c3aed',emoji:'📶'},
  {id:'GSAT30',name:'GSAT-30 (India)',type:'COMMS',noradId:45026,color:'#7c3aed',emoji:'📶'},
  {id:'VS2',name:'ViaSat-2',type:'COMMS',noradId:42741,color:'#8b5cf6',emoji:'📶'},
  {id:'VS3',name:'ViaSat-3 Americas',type:'COMMS',noradId:56217,color:'#8b5cf6',emoji:'📶'},
  {id:'TDRS13',name:'TDRS-13',type:'COMMS',noradId:41724,color:'#7c3aed',emoji:'📶'},
  {id:'YAM402',name:'Yamal-402',type:'COMMS',noradId:39488,color:'#5b21b6',emoji:'📶'},
  {id:'YAM601',name:'Yamal-601',type:'COMMS',noradId:44287,color:'#5b21b6',emoji:'📶'},
  {id:'AP9',name:'APStar-9',type:'COMMS',noradId:41909,color:'#4c1d95',emoji:'📶'},
  {id:'AS8',name:'AsiaSat-8',type:'COMMS',noradId:40107,color:'#7e22ce',emoji:'📶'},
  {id:'AS9',name:'AsiaSat-9',type:'COMMS',noradId:43010,color:'#7e22ce',emoji:'📶'},
  {id:'SL1007',name:'Starlink-1007',type:'COMMS',noradId:44713,color:'#f472b6',emoji:'📶'},
  {id:'SL1130',name:'Starlink-1130',type:'COMMS',noradId:44760,color:'#f472b6',emoji:'📶'},
  {id:'SL2450',name:'Starlink-2450',type:'COMMS',noradId:48074,color:'#f472b6',emoji:'📶'},
  {id:'SL3010',name:'Starlink-3010',type:'COMMS',noradId:49660,color:'#f472b6',emoji:'📶'},
  {id:'SL4055',name:'Starlink-4055',type:'COMMS',noradId:52289,color:'#f472b6',emoji:'📶'},
  {id:'SL5012',name:'Starlink-5012',type:'COMMS',noradId:55620,color:'#f472b6',emoji:'📶'},
  {id:'SL6001',name:'Starlink-6001',type:'COMMS',noradId:57543,color:'#f472b6',emoji:'📶'},
  {id:'OW1',name:'OneWeb-0008',type:'COMMS',noradId:44058,color:'#f9a8d4',emoji:'📶'},
  {id:'OW2',name:'OneWeb-0234',type:'COMMS',noradId:48463,color:'#f9a8d4',emoji:'📶'},
  {id:'CS2_SCI',name:'CryoSat-2',type:'SCIENCE',noradId:36508,color:'#e0f2fe',emoji:'🔬'},
  {id:'GRACFO1',name:'GRACE-FO 1',type:'SCIENCE',noradId:43476,color:'#bae6fd',emoji:'🔬'},
  {id:'SWOT',name:'SWOT',type:'SCIENCE',noradId:54754,color:'#7dd3fc',emoji:'🔬'},
  {id:'CLOUDSAT',name:'CloudSat',type:'SCIENCE',noradId:29107,color:'#e0f2fe',emoji:'🔬'},
  {id:'CALIPSO',name:'CALIPSO',type:'SCIENCE',noradId:29108,color:'#f0f9ff',emoji:'🔬'},
  {id:'OCO2',name:'OCO-2',type:'SCIENCE',noradId:40059,color:'#cffafe',emoji:'🔬'},
  {id:'SUOMI',name:'Suomi NPP',type:'SCIENCE',noradId:37849,color:'#a5f3fc',emoji:'🔬'},
  {id:'JASON3',name:'Jason-3',type:'SCIENCE',noradId:41240,color:'#67e8f9',emoji:'🔬'},
  {id:'ICESAT2',name:'ICESat-2',type:'SCIENCE',noradId:43613,color:'#22d3ee',emoji:'🔬'},
  {id:'AURA',name:'Aura',type:'SCIENCE',noradId:28376,color:'#06b6d4',emoji:'🔬'},
  {id:'SMAP',name:'SMAP',type:'SCIENCE',noradId:40376,color:'#0891b2',emoji:'🔬'},
  {id:'DSCOVR',name:'DSCOVR (L1 Point)',type:'SCIENCE',noradId:40390,color:'#fef3c7',emoji:'🔬'},
  {id:'MAVEN',name:'MAVEN (Mars)',type:'SCIENCE',noradId:40139,color:'#fed7aa',emoji:'🚀'},
  {id:'MRO',name:'Mars Recon. Orbiter',type:'SCIENCE',noradId:28801,color:'#fdba74',emoji:'🚀'},
  {id:'MIL1',name:'USA-326 (NROL-87)',type:'MILITARY',noradId:51118,color:'#dc2626',emoji:'🔒'},
  {id:'MIL2',name:'USA-276 (WGS-9)',type:'MILITARY',noradId:41977,color:'#b91c1c',emoji:'🔒'},
  {id:'MIL3',name:'Kosmos-2519',type:'MILITARY',noradId:42521,color:'#7f1d1d',emoji:'🔒'},
  {id:'MIL4',name:'Yaogan-30 (01)',type:'MILITARY',noradId:42844,color:'#fca5a5',emoji:'🔒'},
  {id:'MIL5',name:'RISAT-2 (India)',type:'MILITARY',noradId:34807,color:'#fca5a5',emoji:'🔒'},
  {id:'MIL6',name:'GeoEye-1',type:'MILITARY',noradId:33331,color:'#ef4444',emoji:'🔒'},
  {id:'MIL7',name:'USA-224 (KH-13)',type:'MILITARY',noradId:36441,color:'#991b1b',emoji:'🔒'}
];

const SHIP_TYPES = ['Cargo', 'Tanker', 'Passenger', 'Fishing', 'Yacht', 'Military'];
const SHIP_PREFIXES = ['MV', 'SS', 'USS', 'HMS', 'RV', 'SY'];
const MAJOR_PORTS = [
  {name:'Shanghai',lat:31.2,lon:121.5},{name:'Singapore',lat:1.3,lon:103.8},
  {name:'Rotterdam',lat:51.9,lon:4.1},{name:'Los Angeles',lat:33.7,lon:-118.2},
  {name:'Dubai',lat:25.3,lon:55.3},{name:'New York',lat:40.7,lon:-74.0},
  {name:'Tokyo',lat:35.6,lon:139.7},{name:'Sydney',lat:-33.9,lon:151.2},
  {name:'Panama Canal',lat:9.1,lon:-79.7},{name:'Suez Canal',lat:30.6,lon:32.3}
];

const VEHICLE_TYPES = ['Car', 'Truck', 'Bus', 'Motorcycle', 'Van'];
const ROAD_LOCATIONS = [
  {country:'USA',state:'California',city:'Los Angeles',lat:34.05,lon:-118.24},
  {country:'USA',state:'California',city:'San Francisco',lat:37.77,lon:-122.41},
  {country:'USA',state:'New York',city:'New York City',lat:40.71,lon:-74.00},
  {country:'USA',state:'Texas',city:'Houston',lat:29.76,lon:-95.36},
  {country:'India',state:'Maharashtra',city:'Mumbai',lat:19.07,lon:72.87},
  {country:'India',state:'Telangana',city:'Hyderabad',lat:17.38,lon:78.48},
  {country:'India',state:'Karnataka',city:'Bangalore',lat:12.97,lon:77.59},
  {country:'India',state:'Delhi',city:'New Delhi',lat:28.61,lon:77.20},
  {country:'UK',state:'England',city:'London',lat:51.50,lon:-0.12},
  {country:'UK',state:'England',city:'Manchester',lat:53.48,lon:-2.24},
  {country:'UK',state:'Scotland',city:'Edinburgh',lat:55.95,lon:-3.18},
  {country:'Germany',state:'Bavaria',city:'Munich',lat:48.13,lon:11.58},
  {country:'Germany',state:'Berlin',city:'Berlin',lat:52.52,lon:13.40},
  {country:'Japan',state:'Tokyo',city:'Tokyo',lat:35.67,lon:139.65},
  {country:'Japan',state:'Osaka',city:'Osaka',lat:34.69,lon:135.50},
  {country:'Australia',state:'New South Wales',city:'Sydney',lat:-33.86,lon:151.20},
  {country:'Australia',state:'Victoria',city:'Melbourne',lat:-37.81,lon:144.96},
  {country:'Brazil',state:'Sao Paulo',city:'Sao Paulo',lat:-23.55,lon:-46.63},
  {country:'Canada',state:'Ontario',city:'Toronto',lat:43.65,lon:-79.38}
];

// ── Generator Functions ──

function generateFlights() {
  const flights = []; let idx = 0;
  ROUTE_DB.forEach((r, ri) => {
    const cnt = 8 + Math.floor(Math.random() * 12); // reduced from 15-35 → 8-20
    for (let i = 0; i < cnt; i++) {
      const p = Math.max(0.03, Math.min(0.97, (i+1)/(cnt+1) + (Math.random()-0.5)*0.12));
      const lat = r[2] + (r[6]-r[2])*p + (Math.random()-0.5)*1.5;
      const lon = r[3] + (r[7]-r[3])*p + (Math.random()-0.5)*1.5;
      const hdg = (Math.atan2(r[7]-r[3], r[6]-r[2])*180/Math.PI+360)%360;
      const pfx = PFXS[(ri*3+i)%PFXS.length];
      flights.push({
        callsign:`${pfx}${100+Math.floor(Math.random()*899)}`,
        originCity:r[0], originCountry:r[1], destCity:r[4], destCountry:r[5],
        operator:r[8], country:r[1],
        lat:Math.max(-80,Math.min(80,lat)), lon:((lon+540)%360)-180,
        alt:7500+Math.floor(Math.random()*4500), spd:400+Math.floor(Math.random()*220),
        hdg:Math.round(hdg), icao:`F${(idx++).toString(16).toUpperCase().padStart(5,'0')}`
      });
    }
  });
  return flights;
}

function generateFakeSat(sat) {
  const t = Date.now()/1000;
  const norad = sat.noradId;
  let alt, incl, period;
  const isGEO = sat.type==='COMMS'&&norad>35000||sat.name.includes('GOES')||sat.name.includes('Meteosat')||sat.name.includes('Yamal')||sat.name.includes('Astra')||(sat.name.includes('Intelsat')&&norad>25000)||sat.name.includes('Eutelsat')||sat.name.includes('Hotbird')||(sat.name.includes('SES')&&norad>40000)||sat.name.includes('APStar')||sat.name.includes('AsiaSat')||(sat.name.includes('GSAT')&&norad>39000)||sat.name.includes('ViaSat-3');
  const isMEO = sat.type==='NAVIGATION';
  if(isGEO){alt=35786;incl=0.05;period=24*60;}
  else if(isMEO){alt=sat.name.includes('Galileo')?23222:sat.name.includes('GLONASS')?19100:sat.name.includes('BeiDou')&&sat.name.includes('GEO')?35786:sat.name.includes('BeiDou')?21528:20200;incl=55+(norad%20)-10;period=12*60;}
  else{alt=400+((norad*7+13)%800);incl=51.6+((norad*3)%45)-22;period=90+((norad*2)%25);}
  const offset=norad>60000?norad*0.13:0;
  const angle=((t/60/period)*360+(norad*137.508)+offset)%360;
  const lat=isGEO?0.05*Math.sin(angle*Math.PI/180):Math.sin((angle+norad*0.7+offset)*Math.PI/180)*Math.min(Math.abs(incl),80);
  let lon=isGEO?((norad*13.7)%360)-180:((angle*1.3+norad*19.47+offset)%360)-180;
  const vel=isGEO?3.07:isMEO?3.87:7.66;
  return {...sat,lat:Math.max(-80,Math.min(80,lat)),lon,alt:Math.round(alt),vel:parseFloat(vel.toFixed(2)),footprint:Math.round(Math.sqrt(2*6371*(alt/1000))*80),visibility:'eclipsed'};
}

// Reduced swarm from 1500 → 300 for performance; still shows a dense constellation
function generateSwarmSatellites(count = 300) {
  const swarm = [];
  for (let i = 0; i < count; i++) {
    const isStarlink = Math.random() > 0.3;
    swarm.push({
      id:`SWARM-${i}`,
      name:isStarlink?`Starlink-${Math.floor(Math.random()*9000)+1000}`:`OneWeb-${Math.floor(Math.random()*1000)+100}`,
      type:'COMMS', noradId:60000+i, color:isStarlink?'#f472b6':'#f9a8d4', emoji:'📶'
    });
  }
  return swarm;
}

function haversineKm(lat1,lon1,lat2,lon2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function calcETA(sat,tgtCoords){
  const dist=haversineKm(sat.lat,sat.lon,tgtCoords.lat,tgtCoords.lon);
  const gv=sat.alt>30000?0.5:sat.alt>5000?1.5:sat.vel*0.8||6;
  const secs=dist/gv;
  if(secs<60)return{text:`${Math.round(secs)}s`,badge:'near'};
  if(secs<3600)return{text:`${Math.floor(secs/60)}m ${Math.round(secs%60)}s`,badge:'mid'};
  if(secs<86400)return{text:`${Math.floor(secs/3600)}h ${Math.floor((secs%3600)/60)}m`,badge:'far'};
  return{text:`${Math.floor(secs/86400)}d ${Math.floor((secs%86400)/3600)}h`,badge:'far'};
}

function generateShips(count = 400) { // reduced from 2500 → 400
  const ships=[];
  for(let i=0;i<count;i++){
    const origin=MAJOR_PORTS[Math.floor(Math.random()*MAJOR_PORTS.length)];
    let dest=MAJOR_PORTS[Math.floor(Math.random()*MAJOR_PORTS.length)];
    while(dest.name===origin.name)dest=MAJOR_PORTS[Math.floor(Math.random()*MAJOR_PORTS.length)];
    const p=Math.random();
    const lat=origin.lat+(dest.lat-origin.lat)*p+(Math.random()-0.5)*5;
    const lon=origin.lon+(dest.lon-origin.lon)*p+(Math.random()-0.5)*5;
    const hdg=(Math.atan2(dest.lon-origin.lon,dest.lat-origin.lat)*180/Math.PI+360)%360;
    ships.push({
      id:`SHP-${1000+i}`,
      name:`${SHIP_PREFIXES[Math.floor(Math.random()*SHIP_PREFIXES.length)]} Ocean ${Math.floor(Math.random()*900)+100}`,
      type:SHIP_TYPES[Math.floor(Math.random()*SHIP_TYPES.length)],
      lat:Math.max(-80,Math.min(80,lat)), lon:((lon+540)%360)-180,
      hdg:Math.round(hdg), spd:10+Math.floor(Math.random()*15),
      origin:origin.name, dest:dest.name,
      flag:['Panama','Liberia','Marshall Islands','China','Singapore'][Math.floor(Math.random()*5)]
    });
  }
  return ships;
}

function generateVehicles(count = 500) { // reduced from 2500 → 500
  const vehicles=[];
  for(let i=0;i<count;i++){
    const loc=ROAD_LOCATIONS[Math.floor(Math.random()*ROAD_LOCATIONS.length)];
    vehicles.push({
      id:`VEH-${10000+i}`, type:VEHICLE_TYPES[Math.floor(Math.random()*VEHICLE_TYPES.length)],
      country:loc.country, state:loc.state, city:loc.city,
      lat:loc.lat+(Math.random()-0.5)*2.8, lon:loc.lon+(Math.random()-0.5)*2.8,
      hdg:Math.random()*360, spd:30+Math.floor(Math.random()*80),
      routeId:`R-${Math.floor(Math.random()*900)+100}`
    });
  }
  return vehicles;
}

// Icon makers (require Leaflet to be loaded)
function makePlaneIcon(hdg){
  const s=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform:rotate(${hdg}deg);filter:drop-shadow(0 0 4px rgba(255,255,255,0.5));"><path d="M 12 2.5 C 11 2.5 10 3.5 10 4.5 L 10 9.5 L 3 14 L 3 16 L 10 13.5 L 10 19 L 7.5 21 L 7.5 22 L 12 21 L 16.5 22 L 16.5 21 L 14 19 L 14 13.5 L 21 16 L 21 14 L 14 9.5 L 14 4.5 C 14 3.5 13 2.5 12 2.5 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.5"/></svg>`;
  return window.L.divIcon({html:s,className:'',iconSize:[24,24],iconAnchor:[12,12]});
}
function makeSatIcon(sat){
  return window.L.divIcon({html:`<div style="font-size:18px;line-height:1;filter:drop-shadow(0 0 3px ${sat.color});opacity:.85;">${sat.emoji}</div>`,className:'',iconSize:[22,22],iconAnchor:[11,11]});
}
function makeShipIcon(hdg,type){
  const colors={'Cargo':'#fbbf24','Tanker':'#f59e0b','Passenger':'#38bdf8','Fishing':'#a3e635','Yacht':'#f472b6','Military':'#ef4444'};
  const color=colors[type]||'#fbbf24';
  const s=`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="transform:rotate(${hdg}deg);filter:drop-shadow(0 0 6px ${color});"><path d="M12 2 L16 6 L16 20 A 4 2 0 0 1 12 22 A 4 2 0 0 1 8 20 L8 6 Z" fill="${color}" stroke="#fff" stroke-width="0.5"/></svg>`;
  return window.L.divIcon({html:s,className:'',iconSize:[20,20],iconAnchor:[10,10]});
}
function makeVehicleIcon(hdg,type){
  const colors={'Car':'#ef4444','Truck':'#f97316','Bus':'#3b82f6','Motorcycle':'#10b981','Van':'#8b5cf6'};
  const color=colors[type]||'#ef4444';
  const s=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style="transform:rotate(${hdg}deg);filter:drop-shadow(0 0 4px ${color});"><path d="M6 4 C6 2, 18 2, 18 4 L18 20 C18 22, 6 22, 6 20 Z" fill="${color}" stroke="#fff" stroke-width="1"/><rect x="8" y="7" width="8" height="4" fill="#1e293b"/><rect x="8" y="14" width="8" height="3" fill="#1e293b"/></svg>`;
  return window.L.divIcon({html:s,className:'',iconSize:[16,16],iconAnchor:[8,8]});
}
