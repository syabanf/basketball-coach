export const players = [
  {
    id: 'pl_01',
    jersey: 1,
    name: 'Jason Hartono',
    position: 'PG',
    positionLong: 'Point Guard',
    height: 175,
    weight: 68,
    age: 23,
    overall: 87,
    status: 'starter',
    attributes: { shooting: 82, passing: 89, dribbling: 90, defense: 75, athleticism: 88, basketballIQ: 86 },
    notes: 'Great court vision and leadership. Improving mid-range consistency.'
  },
  {
    id: 'pl_02',
    jersey: 2,
    name: 'Michael Wijaya',
    position: 'SG',
    positionLong: 'Shooting Guard',
    height: 182,
    weight: 74,
    age: 25,
    overall: 84,
    status: 'starter',
    attributes: { shooting: 91, passing: 76, dribbling: 80, defense: 78, athleticism: 85, basketballIQ: 82 },
    notes: 'Elite catch-and-shoot. Needs to add a pull-up game.'
  },
  {
    id: 'pl_03',
    jersey: 3,
    name: 'Kevin Santoso',
    position: 'SF',
    positionLong: 'Small Forward',
    height: 188,
    weight: 82,
    age: 24,
    overall: 85,
    status: 'starter',
    attributes: { shooting: 80, passing: 78, dribbling: 78, defense: 86, athleticism: 89, basketballIQ: 83 },
    notes: 'Two-way wing, switchable defender.'
  },
  {
    id: 'pl_04',
    jersey: 4,
    name: 'Daniel Putra',
    position: 'PF',
    positionLong: 'Power Forward',
    height: 190,
    weight: 92,
    age: 27,
    overall: 83,
    status: 'rotation',
    attributes: { shooting: 70, passing: 70, dribbling: 65, defense: 84, athleticism: 80, basketballIQ: 81 },
    notes: 'Physical screener, anchors second unit.'
  },
  {
    id: 'pl_05',
    jersey: 5,
    name: 'Andreas Lim',
    position: 'C',
    positionLong: 'Center',
    height: 198,
    weight: 102,
    age: 26,
    overall: 88,
    status: 'starter',
    attributes: { shooting: 60, passing: 68, dribbling: 55, defense: 92, athleticism: 78, basketballIQ: 84 },
    notes: 'Rim protector, vertical lob threat.'
  },
  {
    id: 'pl_06',
    jersey: 6,
    name: 'Bryan Chen',
    position: 'SG',
    positionLong: 'Shooting Guard',
    height: 180,
    weight: 73,
    age: 22,
    overall: 78,
    status: 'bench',
    attributes: { shooting: 84, passing: 70, dribbling: 72, defense: 70, athleticism: 80, basketballIQ: 74 },
    notes: 'Microwave scorer off the bench.'
  },
  {
    id: 'pl_07',
    jersey: 7,
    name: 'Stefan Kurniawan',
    position: 'PG',
    positionLong: 'Point Guard',
    height: 172,
    weight: 66,
    age: 21,
    overall: 76,
    status: 'bench',
    attributes: { shooting: 72, passing: 80, dribbling: 82, defense: 70, athleticism: 82, basketballIQ: 76 },
    notes: 'Quick, pesky on-ball defender. Developing decision making.'
  }
];

export const attributeKeys = [
  { key: 'shooting',     label: 'Shooting' },
  { key: 'passing',      label: 'Passing' },
  { key: 'dribbling',    label: 'Dribbling' },
  { key: 'defense',      label: 'Defense' },
  { key: 'athleticism',  label: 'Athleticism' },
  { key: 'basketballIQ', label: 'Basketball IQ' }
];
