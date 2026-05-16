// Seed library items. `body` is a structured array of sections rendered by
// LibraryDetailPage — keeps content rich without needing a markdown parser.

export const LIBRARY_TYPES = {
  report:   { label: 'Report',    tone: 'brand'   },
  template: { label: 'Templates', tone: 'navy'    },
  document: { label: 'Document',  tone: 'starter' },
  video:    { label: 'Video',     tone: 'rotation' }
};

export const libraryItems = [
  {
    id: 'lib_01',
    title: 'Garuda BC — scouting',
    type: 'report',
    updated: '2024-05-14',
    createdBy: 'Coach Kevin',
    description: 'Pre-match scouting on Garuda BC tendencies, key matchups, and keys to the game.',
    tags: ['Opponent', 'Match', 'Scouting'],
    body: [
      { type: 'paragraph', text:
        'Garuda BC plays a high-tempo, pick-and-roll-heavy offense led by their starting backcourt. They like to attack early in the shot clock from drag screens after a make and operate out of horns sets in the half court. Defensively they switch 1–4 and trap above the break against elite shooters.' },
      { type: 'heading', text: 'Key Players' },
      { type: 'table', columns: ['#', 'Name', 'Pos', 'OVR', 'Tendency'], rows: [
        ['7',  'R. Halim',   'PG', '88', 'Drag screen pull-up; struggles vs ICE'],
        ['14', 'A. Suryadi', 'SG', '85', '38% from C&S; force left'],
        ['22', 'B. Hasan',   'SF', '83', 'Cutter; weak handle'],
        ['33', 'D. Wibowo',  'PF', '80', 'Stretch 4; close hard at the line'],
        ['44', 'I. Pratomo', 'C',  '84', 'Roller; vertical lob threat']
      ] },
      { type: 'heading', text: 'Offensive Tendencies' },
      { type: 'bullets', items: [
        '67% of possessions involve a high ball-screen with #7.',
        'Strong-side overload after the swing — 41% PPP on the second action.',
        'Run "Horns Twist" out of timeouts (4-of-6 ATO efficiency).',
        'Avg possession length: 12.4 sec — push pace early.'
      ] },
      { type: 'heading', text: 'Defensive Tendencies' },
      { type: 'bullets', items: [
        'Switch 1–4 on screens away from the ball.',
        'Trap above the break against #2-marked shooters.',
        'Drop their center (#44) below screen level — open mid-range.',
        'Foul rate elevated in 4Q (#33 in particular).'
      ] },
      { type: 'heading', text: 'Keys to the Game' },
      { type: 'bullets', items: [
        'ICE the side ball-screens with #7; force him left.',
        'Hunt #14 on switches — attack the closeout from above.',
        'Get to the line early; #33 picks up cheap fouls.',
        'Crash from the corner on Garuda misses — they leak out.'
      ] }
    ]
  },

  {
    id: 'lib_02',
    title: 'Floppy variations',
    type: 'template',
    updated: '2024-05-12',
    createdBy: 'Coach Kevin',
    description: 'Three flavors of the classic Floppy action — straight, with a flare, and with a re-screen counter.',
    tags: ['Offense', 'Sets', 'ATO'],
    body: [
      { type: 'paragraph', text:
        'Floppy is a baseline-out action where a shooter chooses between two screens at the elbows. We use it primarily as a get-into action and as an ATO. These variations adjust based on the defense\'s coverage of the shooter.' },
      { type: 'heading', text: 'Variation A — Straight Floppy' },
      { type: 'bullets', items: [
        '2 chooses left or right screen based on defender top-lock.',
        'If 2 curls, 4 dives → kick-out to corner.',
        'If 2 fades, 5 re-screens for the swing.'
      ] },
      { type: 'heading', text: 'Variation B — Flare Counter' },
      { type: 'bullets', items: [
        'Used when the defender is over-playing the curl.',
        '4 sets a flare for 2 instead of a down-screen.',
        'Tip: works best against switch coverage.'
      ] },
      { type: 'heading', text: 'Variation C — Re-screen Punch' },
      { type: 'bullets', items: [
        'After the initial Floppy is denied, 5 sets a pin-down for 3 on the weak side.',
        'Creates a quick second action while the defense is recovering.',
        'High-value possession with 1.18 PPP in our sample.'
      ] }
    ]
  },

  {
    id: 'lib_03',
    title: 'Pre-game speech notes',
    type: 'document',
    updated: '2024-05-11',
    createdBy: 'Coach Kevin',
    description: 'Talking points for the pre-game huddle. Focus on energy, defense, and clarity.',
    tags: ['Pre-game', 'Speech', 'Notes'],
    body: [
      { type: 'paragraph', text:
        'Keep it short. Anchor the message in something concrete the team can carry into the first defensive possession.' },
      { type: 'heading', text: '60-second outline' },
      { type: 'bullets', items: [
        '1. One sentence on tonight\'s identity — who do we want to be?',
        '2. One defensive coverage rule (e.g. "ICE side screens").',
        '3. One offensive emphasis (e.g. "early offense — first good shot").',
        '4. Call-out one teammate by name. Lift them up.',
        '5. Break with the team word.'
      ] },
      { type: 'heading', text: 'Things NOT to say' },
      { type: 'bullets', items: [
        'No statistics — save those for film.',
        'No "must-win" framing — adds pressure.',
        'No criticisms — pre-game is for posture, not corrections.'
      ] },
      { type: 'paragraph', text:
        'Final beat — 5 seconds of silence before the break. Lets the message land.' }
    ]
  },

  {
    id: 'lib_04',
    title: 'Q3 highlight cuts',
    type: 'video',
    updated: '2024-05-09',
    createdBy: 'Hendro Lim',
    description: 'Best offensive possessions from the Q3 stretch of the last match — used for film review.',
    tags: ['Film', 'Highlights', 'Q3'],
    duration: '8:42',
    body: [
      { type: 'paragraph', text:
        'Selected possessions where the spacing, pace, and reads were exactly what we want to repeat. Watch the off-ball cuts on possessions 3 and 7.' },
      { type: 'heading', text: 'Chapters' },
      { type: 'table', columns: ['#', 'Time', 'Play', 'Note'], rows: [
        ['1', '00:14', 'High PnR',        'Pure read — drop coverage, pull-up'],
        ['2', '01:02', 'Floppy',          'Curl + drive, kick to corner'],
        ['3', '02:35', 'Horns Twist',     'Backside cut behind switch'],
        ['4', '03:48', 'Drag Screen',     'Early offense, transition flow'],
        ['5', '05:11', 'Quick Punch',     'Strong-side overload, post entry'],
        ['6', '06:30', 'Horns Flare',     'Re-screen, weak-side hammer'],
        ['7', '07:55', 'Spain PnR',       'Back-screen the dropping big']
      ] },
      { type: 'heading', text: 'Talking points' },
      { type: 'bullets', items: [
        'Pace into the first action — under 8 sec from inbound.',
        'Notice the corner spacing — feet planted, ready to shoot.',
        'Watch how the screener\'s angle changes the read.'
      ] }
    ]
  },

  {
    id: 'lib_05',
    title: '2-3 vs PnR principles',
    type: 'template',
    updated: '2024-05-06',
    createdBy: 'Rian Saputra',
    description: 'How our 2-3 zone defends ball-screens — coverage rules, tags, and red flags.',
    tags: ['Defense', 'Zone', 'PnR'],
    body: [
      { type: 'paragraph', text:
        'The 2-3 zone is vulnerable to high ball-screens unless we communicate. Our rule set is built around the top guards staying connected and the wings pinching to take away the pop.' },
      { type: 'heading', text: 'Coverage rules' },
      { type: 'bullets', items: [
        'Top guard "I" shows hard on the ball-handler, recovers to the elbow.',
        'Strong-side wing pinches to deny the pop.',
        'Weak-side wing rotates to the nail to take away the skip.',
        'Center stays at the rim — rim protection priority over the roller.'
      ] },
      { type: 'heading', text: 'Tags' },
      { type: 'bullets', items: [
        '"Black" — switch the screen (used vs guards 1-2).',
        '"Gold" — trap on the sideline.',
        '"Show" — default coverage, hard hedge.'
      ] },
      { type: 'heading', text: 'Red flags to drill' },
      { type: 'bullets', items: [
        'Top guard not getting back to the elbow → mid-range open.',
        'Center stepping up to the roller → easy lob.',
        'Weak-side wing late on the rotation → corner three.'
      ] }
    ]
  },

  {
    id: 'lib_06',
    title: 'Combine measurements',
    type: 'document',
    updated: '2024-05-02',
    createdBy: 'Dewi Pratiwi',
    description: 'Pre-season combine results for the full roster — height, weight, vertical, sprint.',
    tags: ['Pre-season', 'Combine', 'Data'],
    body: [
      { type: 'paragraph', text:
        'All measurements taken on the same day under standard conditions. Use as a baseline for season-over-season comparison.' },
      { type: 'table', columns: ['#', 'Player', 'Ht', 'Wt', 'Vert', '¾ Sprint', 'BMI'], rows: [
        ['1', 'Jason Hartono',   '175 cm', '68 kg', '78 cm', '3.21s', '22.2'],
        ['2', 'Michael Wijaya',  '182 cm', '74 kg', '74 cm', '3.18s', '22.3'],
        ['3', 'Kevin Santoso',   '188 cm', '82 kg', '82 cm', '3.05s', '23.2'],
        ['4', 'Daniel Putra',    '190 cm', '92 kg', '70 cm', '3.30s', '25.5'],
        ['5', 'Andreas Lim',     '198 cm', '102 kg','68 cm', '3.42s', '26.0'],
        ['6', 'Bryan Chen',      '180 cm', '73 kg', '80 cm', '3.10s', '22.5'],
        ['7', 'Stefan Kurniawan','172 cm', '66 kg', '76 cm', '3.08s', '22.3']
      ] },
      { type: 'heading', text: 'Observations' },
      { type: 'bullets', items: [
        'Kevin Santoso posted the fastest ¾-court sprint and best vertical.',
        'Daniel Putra trending heavier — track conditioning load.',
        'Stefan Kurniawan above team avg in sprint relative to height.'
      ] }
    ]
  }
];
