export const address = {
  playerCount: 0x1a,
  holeNumber: 0x23,
  hole9Base: 0x340,
  totalScoreBase: 0x348,
};

export const pars = {
  0: 2,
  1: 3,
  2: 4,
  3: 2,
  4: 3,
  5: 4,
  6: 2,
  7: 3,
  8: 3,
};

type ParData = {
  title: string;
  hole: number;
  base: number;
};

export const parData: ParData[] = [
  {
    title: "Chuckster's",
    hole: 0,
    base: 0x300,
  },
  {
    title: 'Tin Cup Grill',
    hole: 1,
    base: 0x308,
  },
  {
    title: 'Glowing Greens',
    hole: 2,
    base: 0x310,
  },
  {
    title: 'Mini Pines',
    hole: 3,
    base: 0x318,
  },
  {
    title: 'Little Bully Pulpit',
    hole: 4,
    base: 0x320,
  },
  {
    title: 'Ninja Golf',
    hole: 5,
    base: 0x328,
  },
  {
    title: 'Vitense',
    hole: 6,
    base: 0x330,
  },
  {
    title: 'Valley View',
    hole: 7,
    base: 0x338,
  },
  {
    title: 'Prodigy',
    hole: 8,
    base: 0x340,
  },
];
