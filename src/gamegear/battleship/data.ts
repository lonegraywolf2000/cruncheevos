export const address = {
  gameState: 0x0fc,
  rank: 0x39a,
  battleRound: 0x39b,
  firedWeapon: 0x3f0,
  playerShipId1: 0x3ff,
  enemyShipHp1: 0x41a,
  cheatDetection: 0x431,
  reconDetection: 0x45a,
  playerShotsFired: 0x5b7,
};

type ProgressionData = {
  level: number,
  title: string,
  points: 5 | 10,
  password?: number,
};

export const progressionData: ProgressionData[] = [
  { level: 1, title: 'Cesar Chavez', points: 5, },
  { level: 2, title: 'George Watson', points: 5, password: 7390 },
  { level: 3, title: 'Rafael Peralta', points: 5, password: 9537 },
  { level: 4, title: 'Mary Sears', points: 5, password: 3500 },
  { level: 5, title: 'Roy Benavidez', points: 5, password: 8004 },
  { level: 6, title: 'William Pinckney', points: 5, password: 1553 },
  { level: 7, title: 'Alfredo Gonzalez', points: 10, password: 4653 },
  { level: 8, title: 'Grace Hopper', points: 10, password: 9617 },
];

type WeaponFireType = 'Regular' | 'ScoutShip' | 'ScoutSub';

type WeaponData = {
  id: number;
  name: string;
  title: string;
  points: 3 | 4 | 5;
  fire: WeaponFireType;
};

export const weaponData: WeaponData[] = [
  { id: 1, name: 'MK-48X', title: 'Chris Kyle', points: 4, fire: 'Regular' },
  { id: 2, name: 'Polaris', title: 'Marcus Luttrell', points: 4, fire: 'Regular' },
  { id: 3, name: 'ASROC-71', title: "Rob O'Neill", points: 4, fire: 'Regular' },
  { id: 4, name: 'Sonar', title: 'Jocko Willink', points: 5, fire: 'ScoutSub' },
  { id: 5, name: 'Seadart', title: 'Eddie Gallagher', points: 4, fire: 'Regular' },
  { id: 6, name: 'Aerial Recon', title: 'Adam Brown', points: 5, fire: 'ScoutShip' },
  { id: 7, name: 'Tomahawk', title: 'Michael Monsoor', points: 4, fire: 'Regular' },
  { id: 8, name: 'Harpoon', title: 'Britt Slabinski', points: 4, fire: 'Regular' },
  { id: 9, name: 'P-3 Orion', title: 'Ryan Job', points: 3, fire: 'Regular' },
  { id: 10, name: 'Talos', title: 'Kevin Lacz', points: 3, fire: 'Regular' },
];

type DamagelessData = {
  shipId: number,
  title: string,
  name: string,
  health: number,
  points: 3 | 4 | 5 | 10,
};

export const damagelessData: DamagelessData[] = [
  { shipId: 1, name: 'Battleship', points: 5, title: 'Franklin Van Valkenburgh', health: 5 },
  { shipId: 2, name: 'Carrier', points: 10, title: 'Rick Burgess', health: 8 },
  { shipId: 3, name: 'Cruiser', points: 4, title: 'David A. Olivier', health: 4 },
  { shipId: 4, name: 'Destroyer', points: 4, title: 'Courtney M. Minetree', health: 3 },
  { shipId: 5, name: 'Frigate', points: 3, title: 'Henry A. Walke', health: 2 },
  { shipId: 6, name: 'Submarine', points: 4, title: 'Richard Seif', health: 1 },
];
