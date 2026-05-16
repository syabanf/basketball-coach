// Dummy plays. Each play has a scene with player tokens and drawings.
// Coordinate system matches src/lib/board-geometry.js (1000x940).

export const plays = [
  {
    id: 'play_01',
    title: 'High Pick and Roll',
    category: 'Offense',
    tags: ['Offense', 'Pick & Roll', 'Early Offense'],
    description: 'After the high screen, the PG attacks downhill looking to score, kick out to the weak-side shooter, or hit the roller.',
    createdAt: '2024-05-16T09:00:00Z',
    updatedAt: '2024-05-20T11:30:00Z',
    scene: {
      players: [
        { id: 't1', label: '1', x: 500, y: 760, hasBall: true },
        { id: 't2', label: '2', x: 820, y: 540 },
        { id: 't3', label: '3', x: 180, y: 540 },
        { id: 't4', label: '4', x: 380, y: 360 },
        { id: 't5', label: '5', x: 620, y: 360 }
      ],
      drawings: [
        { id: 'd1', type: 'arrow',     style: 'solid',  points: [{ x: 500, y: 760 }, { x: 560, y: 480 }] },
        { id: 'd2', type: 'pass-line', style: 'dashed', points: [{ x: 500, y: 760 }, { x: 820, y: 540 }] },
        { id: 'd3', type: 'arrow',     style: 'solid',  points: [{ x: 620, y: 360 }, { x: 540, y: 200 }] },
        { id: 'd4', type: 'dribble',   style: 'zigzag', points: [{ x: 820, y: 540 }, { x: 880, y: 320 }] }
      ]
    }
  },
  {
    id: 'play_02',
    title: 'Floppy Action',
    category: 'Offense',
    tags: ['Offense', 'Sets'],
    description: 'Shooter chooses between two screens at the elbows for a catch-and-shoot or curl.',
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-05-18T15:00:00Z',
    scene: {
      players: [
        { id: 't1', label: '1', x: 500, y: 820, hasBall: true },
        { id: 't2', label: '2', x: 500, y: 100 },
        { id: 't3', label: '3', x: 200, y: 700 },
        { id: 't4', label: '4', x: 360, y: 360 },
        { id: 't5', label: '5', x: 640, y: 360 }
      ],
      drawings: [
        { id: 'd1', type: 'arrow', style: 'solid', points: [{ x: 500, y: 100 }, { x: 300, y: 360 }] },
        { id: 'd2', type: 'arrow', style: 'solid', points: [{ x: 500, y: 100 }, { x: 700, y: 360 }] }
      ]
    }
  },
  {
    id: 'play_03',
    title: 'Horns Set',
    category: 'Offense',
    tags: ['Offense', 'Sets', 'Horns'],
    description: 'Double high post screens, PG reads the defense for roll, pop, or hand-off.',
    createdAt: '2024-04-22T08:00:00Z',
    updatedAt: '2024-05-19T10:00:00Z',
    scene: {
      players: [
        { id: 't1', label: '1', x: 500, y: 760, hasBall: true },
        { id: 't2', label: '2', x: 120, y: 720 },
        { id: 't3', label: '3', x: 880, y: 720 },
        { id: 't4', label: '4', x: 380, y: 320 },
        { id: 't5', label: '5', x: 620, y: 320 }
      ],
      drawings: [
        { id: 'd1', type: 'arrow',     style: 'solid',  points: [{ x: 500, y: 760 }, { x: 500, y: 420 }] },
        { id: 'd2', type: 'pass-line', style: 'dashed', points: [{ x: 500, y: 760 }, { x: 120, y: 720 }] }
      ]
    }
  },
  {
    id: 'play_04',
    title: 'Quick Punch',
    category: 'Offense',
    tags: ['Offense', 'ATO'],
    description: 'Quick post entry to the strong-side big with a shooter relocating to the corner.',
    createdAt: '2024-04-12T08:00:00Z',
    updatedAt: '2024-05-12T13:00:00Z',
    scene: {
      players: [
        { id: 't1', label: '1', x: 320, y: 760, hasBall: true },
        { id: 't2', label: '2', x: 880, y: 720 },
        { id: 't3', label: '3', x: 120, y: 720 },
        { id: 't4', label: '4', x: 580, y: 300 },
        { id: 't5', label: '5', x: 380, y: 240 }
      ],
      drawings: [
        { id: 'd1', type: 'pass-line', style: 'dashed', points: [{ x: 320, y: 760 }, { x: 380, y: 240 }] },
        { id: 'd2', type: 'arrow',     style: 'solid',  points: [{ x: 880, y: 720 }, { x: 820, y: 540 }] }
      ]
    }
  },
  {
    id: 'play_05',
    title: 'Diamond Press',
    category: 'Defense',
    tags: ['Defense', 'Full Court'],
    description: 'Full court trap to force a turnover in the backcourt.',
    createdAt: '2024-03-30T08:00:00Z',
    updatedAt: '2024-05-14T16:00:00Z',
    scene: {
      players: [
        { id: 't1', label: '1', x: 500, y: 760, hasBall: true },
        { id: 't2', label: '2', x: 250, y: 600 },
        { id: 't3', label: '3', x: 750, y: 600 },
        { id: 't4', label: '4', x: 500, y: 440 },
        { id: 't5', label: '5', x: 500, y: 220 }
      ],
      drawings: [
        { id: 'd1', type: 'arrow', style: 'solid', points: [{ x: 250, y: 600 }, { x: 420, y: 700 }] },
        { id: 'd2', type: 'arrow', style: 'solid', points: [{ x: 750, y: 600 }, { x: 580, y: 700 }] }
      ]
    }
  },
  {
    id: 'play_06',
    title: '2-3 Zone',
    category: 'Defense',
    tags: ['Defense', 'Zone'],
    description: 'Standard 2-3 zone with strong-side trap on the wing.',
    createdAt: '2024-03-12T08:00:00Z',
    updatedAt: '2024-05-09T10:00:00Z',
    scene: {
      players: [
        { id: 't1', label: '1', x: 400, y: 560 },
        { id: 't2', label: '2', x: 600, y: 560 },
        { id: 't3', label: '3', x: 200, y: 280 },
        { id: 't4', label: '4', x: 500, y: 220 },
        { id: 't5', label: '5', x: 800, y: 280 }
      ],
      drawings: []
    }
  }
];

export const playCategories = ['All', 'Offense', 'Defense', 'Sets', 'ATO', 'Tagged'];
