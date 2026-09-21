import { WaveReport } from '../types';

export const INITIAL_WAVE_REPORTS: WaveReport[] = [
  {
    id: 'rep-1',
    spotId: 'super',
    spotName: 'Supertubes',
    region: 'Eastern Cape',
    authorName: 'Chad van der Merwe',
    authorHandle: '@jbay_local',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: '2026-09-21T11:45:00Z',
    timeAgo: '28m ago',
    waveSize: '4–6ft (Solid Overhead)',
    waveQuality: 'Epic',
    windNote: 'Light offshore SW (8 knots) – perfectly groomed',
    crowdLevel: 'Busy (10-20 out)',
    tideStage: 'Low',
    boardRecommended: '6’2” Step-up / Rounded Pin',
    notes: 'Supertubes is pumping right now! Long peeling sections linking all the way from Boneyards down to the car park. Cold water today (15°C) so bring 3/2mm minimum. High tide push will slow it down in about 2 hours.',
    photoUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    shakasCount: 38,
    hasUserShaka: false,
    comments: [
      {
        id: 'c-1',
        authorName: 'Sipho Zulu',
        timestamp: '15m ago',
        text: 'How is the crowd at Point? Might paddle out there instead with the fish.'
      },
      {
        id: 'c-2',
        authorName: 'Chad van der Merwe',
        timestamp: '9m ago',
        text: 'Point is mellow, maybe 6 guys out and super clean 3ft sets rolling in!'
      }
    ]
  },
  {
    id: 'rep-2',
    spotId: 'muiz',
    spotName: 'Muizenberg Surfers Corner',
    region: 'Cape Peninsula',
    authorName: 'Bianca De Kock',
    authorHandle: '@muiz_mermaids',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    timestamp: '2026-09-21T12:10:00Z',
    timeAgo: '45m ago',
    waveSize: '2–3ft (Waist to Chest)',
    waveQuality: 'Good',
    windNote: 'Gentle NW offshore, glassing off',
    crowdLevel: 'Busy (10-20 out)',
    tideStage: 'Mid Rising',
    boardRecommended: '9’2” Single Fin Log or 7’6” Midlength',
    notes: 'Classic mellow Muizenberg day! Water is unusually warm for September around 18°C. Shark Spotters flag is green (good visibility). Great shape on the sandbank in front of Tiger’s Milk.',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    shakasCount: 24,
    hasUserShaka: true,
    comments: [
      {
        id: 'c-3',
        authorName: 'Liam O’Connor',
        timestamp: '22m ago',
        text: 'Any parking left on the beachfront or is it packed?'
      },
      {
        id: 'c-4',
        authorName: 'Bianca De Kock',
        timestamp: '18m ago',
        text: 'Plenty of spots near the station! Enjoy the gliders.'
      }
    ]
  },
  {
    id: 'rep-3',
    spotId: 'yzer',
    spotName: 'Yzerfontein Main Beach',
    region: 'West Coast',
    authorName: 'Gerrit Smit',
    authorHandle: '@westcoast_tracks',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    timestamp: '2026-09-21T10:15:00Z',
    timeAgo: '1h 35m ago',
    waveSize: '3–4ft (Chest to Head)',
    waveQuality: 'Good',
    windNote: 'Light East (offshore breeze)',
    crowdLevel: 'Mellow (3-8 out)',
    tideStage: 'Mid Dropping',
    boardRecommended: '5’10” Performance Shortboard or Twin Fin',
    notes: 'Clean morning peaks peeling both ways across the beach. Cold Atlantic water (13°C), 4/3mm wetsuit necessary. Skaapeiland has a few heavy wedges hitting the slab if you have the stones for it!',
    photoUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    shakasCount: 19,
    hasUserShaka: false,
    comments: []
  },
  {
    id: 'rep-4',
    spotId: 'durban',
    spotName: 'Durban New Pier',
    region: 'KwaZulu-Natal',
    authorName: 'Jabu Ndlovu',
    authorHandle: '@durban_barrels',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    timestamp: '2026-09-21T09:30:00Z',
    timeAgo: '2h 15m ago',
    waveSize: '3–4ft (Punchy A-frames)',
    waveQuality: 'Good',
    windNote: 'Early morning SW light offshore, turning NE soon',
    crowdLevel: 'Busy (10-20 out)',
    tideStage: 'Mid Rising',
    boardRecommended: 'Shortboard / Quad Fin',
    notes: 'Warm 23°C water, boardies or springsuit heaven! North side of the pier is throwing quick hollow bowls before the afternoon northeast wind kicks in. Get out before 11am.',
    photoUrl: 'https://images.unsplash.com/photo-1486899430790-61dbf6f6d98b?auto=format&fit=crop&w=800&q=80',
    shakasCount: 29,
    hasUserShaka: false,
    comments: [
      {
        id: 'c-5',
        authorName: 'Travis R.',
        timestamp: '1h ago',
        text: 'Northeast has started puffing lightly at Addington, still glassy near pier!'
      }
    ]
  },
  {
    id: 'rep-5',
    spotId: 'vic',
    spotName: 'Victoria Bay',
    region: 'Garden Route',
    authorName: 'Annelie Marais',
    authorHandle: '@gardenroute_surf',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    timestamp: '2026-09-21T08:00:00Z',
    timeAgo: '4h ago',
    waveSize: '3ft (Chest high)',
    waveQuality: 'Good',
    windNote: 'Calm glassy conditions in the cove',
    crowdLevel: 'Mellow (3-8 out)',
    tideStage: 'Low',
    boardRecommended: 'Fish / Twin Fin or Malibu',
    notes: 'Vic Bay is walled up nicely! Wrapping around the pier boulders with clean, playful right walls. Perfect session before breakfast at the point cabins.',
    shakasCount: 16,
    hasUserShaka: false,
    comments: []
  }
];
