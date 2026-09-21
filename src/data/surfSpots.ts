import { SurfSpot } from '../types';

export const SURF_SPOTS: SurfSpot[] = [
  // West Coast
  {
    id: 'yzer',
    name: 'Yzerfontein Main Beach',
    town: 'Yzerfontein',
    region: 'West Coast',
    lat: -33.3411,
    lng: 18.1611,
    type: 'Beachbreak',
    difficulty: 'Beginner–Intermediate',
    hazards: 'Cold Atlantic water (12–14°C) and strong rips on larger swells. Keep clear of boat launch slipway.',
    bestTide: 'Mid',
    ideal: {
      surf: [135, 225, 1.6, 18],
      bodyboard: [135, 225, 1.3, 18],
      kite: [170, 0, 0.4, 28]
    },
    writeup: 'Wide open sandy beachbreak with multiple rolling peaks. Mellow and consistent, offering great shape with east or south-east offshore breezes.'
  },
  {
    id: 'skaap',
    name: 'Skaapeiland',
    town: 'Yzerfontein',
    region: 'West Coast',
    lat: -33.348,
    lng: 18.151,
    type: 'Slab wedge',
    difficulty: 'Advanced',
    hazards: 'Shallow urchin-encrusted kelp reef shelf and heavy sucking wedge. Know your exit before paddling out.',
    bestTide: 'Low',
    ideal: {
      surf: [135, 225, 2.0, 14],
      bodyboard: [135, 225, 1.6, 15],
      kite: [150, 0, 0.3, 30]
    },
    writeup: 'A punchy left and right slab wedge that bounces off the headland reef. Fast drop, hollow barrel, and thick lip on southwest pulses.'
  },
  {
    id: 'elands',
    name: 'Elands Bay',
    town: 'Elands Bay',
    region: 'West Coast',
    lat: -32.315,
    lng: 18.325,
    type: 'Point break',
    difficulty: 'Advanced',
    hazards: 'Long paddle against the rip, kelp beds, shallow rock section at Baboon Point.',
    bestTide: 'Low',
    ideal: {
      surf: [110, 180, 2.2, 16],
      bodyboard: [110, 180, 1.8, 16],
      kite: [180, 240, 0.5, 25]
    },
    writeup: 'The jewel of the West Coast. A world-class peeling left-hand point break that runs for hundreds of metres when south-southwest swells wrap into the bay under SE winds.'
  },
  {
    id: 'paternoster',
    name: 'Paternoster Bay',
    town: 'Paternoster',
    region: 'West Coast',
    lat: -32.81,
    lng: 17.89,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Cold water, granite boulders, isolated coastline.',
    bestTide: 'Mid',
    ideal: {
      surf: [130, 220, 1.7, 16],
      bodyboard: [130, 220, 1.4, 18],
      kite: [160, 210, 0.4, 28]
    },
    writeup: 'Charming fishing village with punchy beachbreaks that fire when a hefty groundswell wraps past Cape Columbine.'
  },

  // Table Bay & Blouberg
  {
    id: 'melkbos',
    name: 'Melkbosstrand Main',
    town: 'Melkbos',
    region: 'Table Bay',
    lat: -33.725,
    lng: 18.442,
    type: 'Beachbreak',
    difficulty: 'Beginner–Intermediate',
    hazards: 'Heavy dumping shorebreak at high tide and cold water currents.',
    bestTide: 'Mid',
    ideal: {
      surf: [135, 240, 1.6, 17],
      bodyboard: [135, 240, 1.3, 17],
      kite: [155, 0, 0.3, 29]
    },
    writeup: 'Clean open peaks stretching north along the white dunes. Fantastic view across Table Bay and reliable offshore wind early in the morning.'
  },
  {
    id: 'derde',
    name: 'Derde Steen',
    town: 'Blouberg',
    region: 'Table Bay',
    lat: -33.765,
    lng: 18.455,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Punchy heavy shorebreak and sudden sweep currents.',
    bestTide: 'Mid',
    ideal: {
      surf: [135, 225, 1.5, 16],
      bodyboard: [135, 225, 1.1, 16],
      kite: [150, 0, 0.4, 30]
    },
    writeup: 'One of the best hollow beachbreaks on the Blouberg stretch. Fast rights and lefts on clean offshore mornings with Table Mountain backdrop.'
  },
  {
    id: 'bigbay',
    name: 'Big Bay',
    town: 'Bloubergstrand',
    region: 'Table Bay',
    lat: -33.79,
    lng: 18.46,
    type: 'Beachbreak',
    difficulty: 'Beginner–Intermediate',
    hazards: 'Crowds on weekends, submerged rocks around the island.',
    bestTide: 'All tides',
    ideal: {
      surf: [140, 230, 1.4, 18],
      bodyboard: [140, 230, 1.2, 18],
      kite: [160, 220, 0.4, 32]
    },
    writeup: 'The kite and surf hub of Blouberg. Plenty of surf shops, cafes, and consistent waves sheltered by the two rocky islands.'
  },

  // Cape Peninsula (Atlantic & False Bay)
  {
    id: 'lludno',
    name: 'Llandudno',
    town: 'Llandudno',
    region: 'Cape Peninsula',
    lat: -34.01,
    lng: 18.34,
    type: 'Beachbreak',
    difficulty: 'Advanced',
    hazards: 'Shallow sandbars, intense backwash off granite boulders, freezing 10–13°C upwelling.',
    bestTide: 'Low',
    ideal: {
      surf: [110, 190, 1.8, 15],
      bodyboard: [110, 190, 1.5, 15],
      kite: [140, 190, 0.3, 24]
    },
    writeup: 'One of the most scenic beachbreaks on Earth. Hollow A-frame barrels wedging off huge granite boulders under southeast winds.'
  },
  {
    id: 'dungeons',
    name: 'Dungeons',
    town: 'Hout Bay',
    region: 'Cape Peninsula',
    lat: -34.058,
    lng: 18.342,
    type: 'Big-wave reef',
    difficulty: 'Expert',
    hazards: 'Massive 15–30ft+ open-ocean waves, seal island nearby, heavy hold-downs. Jet-ski tow and safety vests compulsory.',
    bestTide: 'Low',
    ideal: {
      surf: [135, 225, 4.5, 14],
      bodyboard: [135, 225, 3.5, 14],
      kite: [160, 0, 0.2, 25]
    },
    writeup: 'World-famous big wave proving ground under the Sentinel cliffs of Hout Bay. Shifting peaks breaking over deep boulder reefs.'
  },
  {
    id: 'longbeach',
    name: 'Long Beach',
    town: 'Kommetjie',
    region: 'Cape Peninsula',
    lat: -34.14,
    lng: 18.32,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Crowded peak, ripping currents, thick kelp beds at the ends.',
    bestTide: 'Mid',
    ideal: {
      surf: [120, 200, 1.8, 14],
      bodyboard: [120, 200, 1.4, 15],
      kite: [160, 210, 0.3, 26]
    },
    writeup: 'Cape Town’s premier left-hand high-performance beachbreak. Handles southeast wind brilliantly and provides crisp rippable walls.'
  },
  {
    id: 'outerkom',
    name: 'Outer Kom',
    town: 'Kommetjie',
    region: 'Cape Peninsula',
    lat: -34.15,
    lng: 18.32,
    type: 'Reef',
    difficulty: 'Advanced',
    hazards: 'Shallow kelp reef, long paddle out through channels, heavy boil sections.',
    bestTide: 'High',
    ideal: {
      surf: [120, 190, 2.8, 14],
      bodyboard: [120, 190, 2.2, 14],
      kite: [160, 200, 0.3, 26]
    },
    writeup: 'A premier big-wave left-hand reef that holds up to 15ft. Peels down the reef with power and speed into the Kommetjie kelp channel.'
  },
  {
    id: 'muiz',
    name: 'Muizenberg Surfers Corner',
    town: 'Muizenberg',
    region: 'Cape Peninsula',
    lat: -34.1081,
    lng: 18.4721,
    type: 'Beachbreak',
    difficulty: 'Beginner',
    hazards: 'Busy lineups with beginners and surf schools. Shark Spotters flag active daily.',
    sharkSpotters: true,
    bestTide: 'All tides',
    ideal: {
      surf: [315, 195, 1.2, 16],
      bodyboard: [315, 195, 0.9, 16],
      kite: [160, 0, 0.3, 25]
    },
    writeup: 'The beating heart of South African surf culture. Gentle rolling sandbar waves, warm water (17–20°C in False Bay), historic Victorian bathing boxes, and vibrant surf cafes.'
  },
  {
    id: 'kalk',
    name: 'Kalk Bay Reef',
    town: 'Kalk Bay',
    region: 'Cape Peninsula',
    lat: -34.1275,
    lng: 18.4483,
    type: 'Reef left',
    difficulty: 'Advanced',
    hazards: 'Very shallow exposed reef shelf, harbor wall backwash, tight takeoff spot.',
    bestTide: 'High',
    ideal: {
      surf: [315, 205, 1.8, 13],
      bodyboard: [315, 205, 1.4, 13],
      kite: [160, 0, 0.2, 24]
    },
    writeup: 'A legendary, intense left-hand slab wedging off the Kalk Bay reef shelf. Fast, hollow, and unforgiving right in front of the train line.'
  },

  // Overberg
  {
    id: 'kogel',
    name: 'Kogel Bay (Caves)',
    town: "Gordon's Bay",
    region: 'Overberg',
    lat: -34.24,
    lng: 18.79,
    type: 'Beachbreak',
    difficulty: 'Advanced',
    hazards: 'Heavy dumping shorebreak, steep sand shelf, strong rip currents.',
    bestTide: 'Low',
    ideal: {
      surf: [300, 45, 1.8, 16],
      bodyboard: [300, 45, 1.5, 17],
      kite: [160, 220, 0.4, 28]
    },
    writeup: 'Dramatic mountain backdrop on Clarence Drive. Caves produces heavy, hollow sandbar barrels favoured by bodyboarders and barrel chargers.'
  },
  {
    id: 'onrus',
    name: 'Onrus River Mouth',
    town: 'Hermanus',
    region: 'Overberg',
    lat: -34.42,
    lng: 19.15,
    type: 'Reef',
    difficulty: 'Intermediate',
    hazards: 'River mouth current, rocky ledge, local crowd.',
    bestTide: 'Mid',
    ideal: {
      surf: [310, 40, 1.7, 15],
      bodyboard: [310, 40, 1.3, 16],
      kite: [170, 230, 0.4, 27]
    },
    writeup: 'Punchy river mouth wedge with both lefts and rights breaking into a sheltered cove. Popular local bodyboard and surf hotspot.'
  },

  // Garden Route
  {
    id: 'mossel',
    name: 'The Point (Outer Pool)',
    town: 'Mossel Bay',
    region: 'Garden Route',
    lat: -34.18,
    lng: 22.15,
    type: 'Reef',
    difficulty: 'Advanced',
    hazards: 'Sharp rocky point entry/exit, urchins, boil rocks.',
    bestTide: 'Low',
    ideal: {
      surf: [270, 340, 2.2, 14],
      bodyboard: [270, 340, 1.6, 14],
      kite: [170, 240, 0.4, 25]
    },
    writeup: 'A high quality right-hand point reef breaking along the natural headland. Can hold solid size and provides long, peeling walls.'
  },
  {
    id: 'vic',
    name: 'Victoria Bay',
    town: 'George',
    region: 'Garden Route',
    lat: -33.987,
    lng: 22.548,
    type: 'Point left',
    difficulty: 'Intermediate',
    hazards: 'Point rocks on takeoff, narrow cove with high surfer density.',
    bestTide: 'Mid',
    ideal: {
      surf: [325, 210, 1.6, 15],
      bodyboard: [325, 210, 1.2, 15],
      kite: [170, 0, 0.3, 28]
    },
    writeup: 'Garden Route’s favourite surf cove. Consistent, perfectly peeling right-hand point running along the boulder pier, sheltered from strong winds.'
  },
  {
    id: 'wilderness',
    name: 'Wilderness Beach',
    town: 'Wilderness',
    region: 'Garden Route',
    lat: -33.99,
    lng: 22.59,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Strong undercurrents and shifting offshore sandbanks.',
    bestTide: 'Low',
    ideal: {
      surf: [320, 20, 1.5, 16],
      bodyboard: [320, 20, 1.2, 16],
      kite: [170, 240, 0.4, 28]
    },
    writeup: 'Endless golden beach with shifting peaks along the National Park coastline. Great for escaping crowds.'
  },
  {
    id: 'buffels',
    name: 'Buffalo Bay (Buffs)',
    town: 'Knysna',
    region: 'Garden Route',
    lat: -34.08,
    lng: 22.97,
    type: 'Point break',
    difficulty: 'Beginner–Intermediate',
    hazards: 'Sand spit sweep, shallow entry stones.',
    bestTide: 'Mid',
    ideal: {
      surf: [300, 360, 1.6, 15],
      bodyboard: [300, 360, 1.2, 15],
      kite: [180, 230, 0.4, 25]
    },
    writeup: 'Sheltered right-hand point wrapping into the bay. Super fun longboard and intermediate wave with warm water in summer.'
  },
  {
    id: 'plett',
    name: 'Lookout Beach',
    town: 'Plettenberg Bay',
    region: 'Garden Route',
    lat: -34.05,
    lng: 23.37,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Keurbooms river mouth currents and shifting banks.',
    bestTide: 'Mid',
    ideal: {
      surf: [270, 330, 1.5, 16],
      bodyboard: [270, 330, 1.2, 16],
      kite: [170, 220, 0.4, 28]
    },
    writeup: 'Plett’s central surf beach, with dynamic sandbars formed by the river mouth. Pristine bay with frequent dolphin sightings in the lineup.'
  },

  // Eastern Cape / J-Bay
  {
    id: 'super',
    name: 'Supertubes',
    town: 'Jeffreys Bay',
    region: 'Eastern Cape',
    lat: -34.035,
    lng: 24.93,
    type: 'Right point',
    difficulty: 'Advanced',
    hazards: 'Sharp urchin-riddled mussel reef, fast down-the-line speed required, competitive local and pro crowd.',
    bestTide: 'Low',
    ideal: {
      surf: [225, 290, 2.0, 14],
      bodyboard: [225, 290, 1.5, 14],
      kite: [160, 0, 0.3, 27]
    },
    writeup: 'Widely regarded as the best right-hand point break in the world. Sections link up from Boneyards through Supertubes, Coins, and Impossibles into The Point for a 300m+ ride.'
  },
  {
    id: 'point',
    name: 'The Point (J-Bay)',
    town: 'Jeffreys Bay',
    region: 'Eastern Cape',
    lat: -34.045,
    lng: 24.925,
    type: 'Right point',
    difficulty: 'Beginner–Intermediate',
    hazards: 'Slippery stones on entry, drift down to Albatross.',
    bestTide: 'All tides',
    ideal: {
      surf: [220, 290, 1.5, 15],
      bodyboard: [220, 290, 1.1, 15],
      kite: [160, 0, 0.3, 27]
    },
    writeup: 'Mellow, rolling right-hand walls that are forgiving and ideal for longboards, fish, and developing surfers when Supers is pumping.'
  },
  {
    id: 'sealpoint',
    name: 'Seal Point',
    town: 'Cape St Francis',
    region: 'Eastern Cape',
    lat: -34.20,
    lng: 24.84,
    type: 'Right point',
    difficulty: 'Advanced',
    hazards: 'Rocky shelf takeoff, lighthouse reef boil, strong sea winds.',
    bestTide: 'Low',
    ideal: {
      surf: [260, 330, 1.8, 14],
      bodyboard: [260, 330, 1.4, 15],
      kite: [170, 220, 0.4, 28]
    },
    writeup: 'Right in front of the historic Cape St Francis lighthouse. A peeling right point that handles good size and produces fast turn sections.'
  },
  {
    id: 'nahoon',
    name: 'Nahoon Reef',
    town: 'East London',
    region: 'Eastern Cape',
    lat: -32.99,
    lng: 27.95,
    type: 'Reef',
    difficulty: 'Advanced',
    hazards: 'Urchin reef, long paddle across the deep channel, shark activity warnings.',
    bestTide: 'Mid',
    ideal: {
      surf: [270, 340, 2.0, 15],
      bodyboard: [270, 340, 1.5, 16],
      kite: [170, 220, 0.4, 27]
    },
    writeup: 'East London’s iconic contest break. Heavy right-hand reef with steep drops and a hollow inside section.'
  },

  // Wild Coast
  {
    id: 'coffee',
    name: 'Coffee Bay',
    town: 'Coffee Bay',
    region: 'Wild Coast',
    lat: -31.98,
    lng: 29.15,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Remote location, river mouth current, minimal medical infrastructure nearby.',
    bestTide: 'Mid',
    ideal: {
      surf: [260, 320, 1.7, 15],
      bodyboard: [260, 320, 1.3, 16],
      kite: [180, 240, 0.4, 25]
    },
    writeup: 'Untamed Wild Coast paradise. River mouth and beach peaks surrounded by dramatic green headlands and Hole in the Wall.'
  },
  {
    id: 'mdumbi',
    name: 'Mdumbi Point',
    town: 'Mdumbi',
    region: 'Wild Coast',
    lat: -31.24,
    lng: 29.64,
    type: 'Point break',
    difficulty: 'Advanced',
    hazards: 'Remote dirt road access, point rocks, no surf shops nearby (bring your own wax & dings kit).',
    bestTide: 'Low',
    ideal: {
      surf: [270, 340, 1.8, 14],
      bodyboard: [270, 340, 1.3, 14],
      kite: [180, 240, 0.4, 26]
    },
    writeup: 'One of the best undiscovered right points in Southern Africa. Long, mechanical rights peeling down a sand-bottom point in a pristine rural setting.'
  },

  // KwaZulu-Natal (Durban, North & South Coast)
  {
    id: 'durban',
    name: 'Durban New Pier',
    town: 'Durban',
    region: 'KwaZulu-Natal',
    lat: -29.8521,
    lng: 31.041,
    type: 'Pier sandbar',
    difficulty: 'Intermediate',
    hazards: 'Concrete pier pilings, strong sweep on bigger swells, competitive lineup.',
    bestTide: 'Mid',
    ideal: {
      surf: [290, 170, 1.6, 18],
      bodyboard: [290, 170, 1.2, 18],
      kite: [160, 0, 0.4, 28]
    },
    writeup: 'The epicenter of South African high-performance surfing. Warm 23–26°C water year-round, sand-pumping pier banks, and hollow wedging rights and lefts.'
  },
  {
    id: 'northbeach',
    name: 'North Beach',
    town: 'Durban',
    region: 'KwaZulu-Natal',
    lat: -29.85,
    lng: 31.04,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Crowded Golden Mile lineup, pier current.',
    bestTide: 'Mid',
    ideal: {
      surf: [280, 180, 1.5, 17],
      bodyboard: [280, 180, 1.2, 17],
      kite: [160, 210, 0.4, 29]
    },
    writeup: 'Classic Durban beachbreak wedging off the pier with punchy peaks that stay ridable across all tides.'
  },
  {
    id: 'ballito',
    name: 'Willard Beach',
    town: 'Ballito',
    region: 'KwaZulu-Natal',
    lat: -29.54,
    lng: 31.21,
    type: 'Beachbreak',
    difficulty: 'Intermediate',
    hazards: 'Shifting bank rip currents, sandbar dump at high tide.',
    bestTide: 'Low',
    ideal: {
      surf: [280, 160, 1.6, 16],
      bodyboard: [280, 160, 1.3, 16],
      kite: [170, 220, 0.4, 28]
    },
    writeup: 'Home of the annual Ballito Pro WSL contest. Consistent, punchy beachbreak on the Dolphin Coast with warm subtropical water and right/left bowls.'
  },
  {
    id: 'saltrock',
    name: 'Salt Rock',
    town: 'Salt Rock',
    region: 'KwaZulu-Natal',
    lat: -29.50,
    lng: 31.24,
    type: 'Reef',
    difficulty: 'Advanced',
    hazards: 'Tidal reef shelf, backwash off main rock.',
    bestTide: 'Mid',
    ideal: {
      surf: [280, 150, 1.7, 15],
      bodyboard: [280, 150, 1.4, 16],
      kite: [170, 220, 0.4, 28]
    },
    writeup: 'A hollow, wedgey right that bounces off the tidal rocks. Fast barrels for bodyboarders and agile surfers.'
  },
  {
    id: 'scott',
    name: 'Scottburgh Point',
    town: 'Scottburgh',
    region: 'KwaZulu-Natal',
    lat: -30.28,
    lng: 30.75,
    type: 'Point break',
    difficulty: 'Intermediate',
    hazards: 'River mouth sand sweep and occasional shark advisories.',
    bestTide: 'Low',
    ideal: {
      surf: [290, 160, 1.7, 16],
      bodyboard: [290, 160, 1.2, 16],
      kite: [170, 230, 0.4, 27]
    },
    writeup: 'South Coast gem. A classic sand point breaking off the southern river bank with long running walls.'
  }
];
