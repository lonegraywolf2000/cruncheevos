export const address = {
  animationState: 0x71,
  spritePointer: 0xce,
  gameMode: 0x100,
  activeRoom: 0x10b,
  exitMode: 0xdd5,
  levelId: 0x13bf,
  levelCompleteBase: 0x1ea2,
  exitCount: 0x1f2e,
};

type LevelData = [string, number, string?];

export const levelLookup: Record<number, LevelData> = {
  0x28: ['Welcome', 0],
  0x4d: ['Run For Your Life', 1, 'Why Walk?'],
  // beginner
  0x2a: ['Learn to Jump', 2, 'We Did This Last Level?'],
  0x2b: ['Regrabs', 2, 'Multi Tap'],
  0x44: ['Mini Pits', 2, "Alright, That's Cool"],
  0x43: ['Chuck Gates', 2, 'Jump For Joy'],
  0x31: ['Rexes and Rhinos', 3, 'Dino Might'],
  0x30: ['Goomba (Bubble) Jump', 3, 'Soapy Bubble'],
  0x45: ['Slopes', 2, 'Soaring With Sore Butts'], // MOON!
  0x10: ['Jump Test', 5, "Chuck's Slopey Bubble Exam"],
  // platform
  0x34: ['The Shell Jump', 3, 'Starting Simple With Shells'],
  0x01: ["It's Platforming", 2, 'Silly Experimentation'],
  0x02: ['Timed Platforms', 2, 'Counting Down The Days Until Mastery'],
  0x03: ['Kaizo Klazzics', 2, 'The Original Bad Time'], // Harder path!
  0x04: ['Cannon Speed', 2, 'The Power Of Momentum'],
  0x05: ['Fisher of Boos', 3, 'Missing One Kingfisher 9000'],
  0x07: ['On-off Blocks', 2, 'Super Mario Maker'],
  0x19: ['Platform Test', 5, 'The Cannon Counting Switch Exam'],
  // spin
  0x58: ['Spin With Object', 2, 'Vanilla Ice'],
  0x59: ['Lotsa Spins', 3, 'Holy Kaizo Batman!'],
  0x40: ['Falling Spike', 3, 'Stalagmite No More'],
  0x41: ['Thwomp Jump', 3, 'One Crush'],
  0x18: ['Torpedo Theodore', 2, 'Salute To Alex Trebek'],
  0x42: ['Spring Jumps', 2, 'Hop To It'],
  0x15: ['Spin Test', 5, "Ted's Spinny Spiky Exam"],
  // random
  0x5b: ['Chuck Hell', 4, 'More Than Just American Football'], // MANY Moons?!?!? possibly 2 in football screen.
  0x56: ['Fish Out of Water', 3, 'How Did They Get Here Anyway?'],
  0x5d: ['Vines and Beans', 4, 'Climbing To Protein'], // TWO MOONS! (though the 2nd one may be auto grabbed)
  0x5e: ['The Bomb.com', 3, 'Geronimo!'],
  0x5f: ["Hacker's Fave Tool", 4, 'One Fine Zero'],
  0x17: ['Random Test', 5, "Chuck's Explosive Parachuting Exam"],
  // key n swim
  0x4e: ['Block Grab', 2, 'Not Quite Coyote Time'],
  0x4f: ['Two Sprites', 4, 'Awkward Interactions'],
  0x50: ['Keys Keys Keys', 4, 'I See I See I See'],
  0x51: ['Key Jump, Vine Carry', 3, 'Needs More Than Six Seconds'], // Challenge: no vine on first screen
  0x54: ['Down Swim', 3, 'Munchers Are Not Calming'],
  0x55: ['Up And Item Swim', 3, 'We Have Liftoff...In Water?'],
  0x5a: ['Swim Thru Dolphins', 2, 'The Power Of X-Ray'],
  0x13: ['Key to Swim Test', 5, "Munchers' Swimming And Jumping Exam"],
  // git gud
  0x39: ['Turnblocks N Moles', 4, 'Slowly Digging It'], // kaizo block, turnaround shell challenge without mole?
  0x47: ['P Switches', 2, 'Quick Time Event'],
  0x48: ['Midair P Activation', 3, 'Quick Time Headache'],
  0x49: ['P Switch Yumps', 4, 'Frame Perfect Event'],
  0x46: ['Disco Inferno', 5, 'Stick To The Sixties'],
  0x4c: ['Grinder Spinning', 3, 'Gearing Up'],
  0x12: ['Surfin P Test', 5, "Disco's Hungry Gear Switch Exam"], // deathless challenge
  // yoshi
  0x52: ['F(Y)eed(t) the Yosh', 3, 'Stupid Horse'],
  0x4a: ['Yoshi Learns Colors', 5, 'Art Attack'],
  0x53: ['Double Eat', 4, 'Glutton For Punishment'],
  0x57: ['Yoshi Spring, Shell', 5, 'Assisted Leaping'],
  0x16: ['Yoshi Test', 5, "Yoshi's Colorful Hungry Yeet Exam"],
  // cape
  0x3a: ['Basic Cape Tech', 5, 'I Believe I Can Fly'],
  0x3c: ['Right Tight Flight', 4, 'Narrow Corridors'], // Sticky Fly Opportunity (don't do the over the goal thing)
  0x2d: ['Learn 2 Spin(fly)', 3, 'Whirling Dervish'],
  0x2c: ['Cape Cancel', 3, "I'm Not A Loony!"],
  0x2f: ['Stuck on Kaizo', 3, 'Similar To Honey?'],
  0x3b: ['Caped Shell Jump', 3, 'Floating Down To Victory'],
  0x2e: ['Patched Turnaround', 3, 'You Spin Me Right Round'],
  0x14: ['Cape Test', 10, 'The Narrow Sticky Flying Exam'],
  // shell
  0x33: ['Shell Buckets', 4, 'Oh Bucket'],
  0x35: ['Shell Nudges', 4, 'Say No More'],
  0x36: ['Assisted 2x Shell', 4, 'Good News: Help Has Arrived'],
  0x37: ['Full Double Shell', 5, "Bad News: You're On Your Own"],
  0x38: ['Turnback and Go!', 3, 'Jojo May Disapprove'],
  0x5c: ['Special Green Shell', 4, 'Multi-Purpose Shell'],
  0x11: ['Shell Test', 10, 'The Nudgy Assistant Exam'],
  // asm and final
  0x09: ['Motor Skills', 4, 'Finely Tuned'],
  0x0a: ['Multi-Jump', 4, 'Where Is Cappy?'],
  0x0b: ['Controlling On-Off', 4, 'Now I Have The Power'],
  0x1b: ['Final Test', 25, "At Least It's Not Five Rooms"], // Deathless possible
  0x06: ['Credits', 0],
};

type MoonData = {
  level: number;
  room: number;
  points: number;
  title: string;
  location?: string;
  tiles: number[];
};

export const moonData: MoonData[] = [
  {
    level: 0x45,
    room: 0x0121,
    points: 4,
    title: 'Conservation Of Momentum',
    tiles: [0xcb3e],
  },
  {
    level: 0x15,
    room: 0x0015,
    points: 10,
    title: 'Teddy Rides Again',
    tiles: [0xcfd9, 0xcfdc],
  },
  {
    level: 0x5b,
    room: 0x0137,
    points: 10,
    title: 'Across BAO Bridge',
    tiles: [0xce7e],
    location: ' in the BAO Bridge room',
  },
  {
    level: 0x5b,
    room: 0x0049,
    points: 5,
    title: 'Seeing Chuck Rock',
    tiles: [0xcaa4],
    location: ' in the Rock room',
  },
  {
    level: 0x5b,
    room: 0x4a,
    points: 10,
    title: 'He Shoots, You Score',
    tiles: [0xca15],
    location: ' in the Football room by the secret door',
  },
  {
    level: 0x5d,
    room: 0x0139,
    points: 5,
    title: "Where's My Chainsaw?",
    tiles: [0xfaf2],
    location: ' in the Vines portion',
  },
];

export const levelOrder = [
  0x28, 0x4d, 0x2a, 0x2b, 0x44, 0x43, 0x31, 0x30, 0x45, 0x10, 0x34, 0x01, 0x02, 0x03, 0x04, 0x05, 0x07, 0x19, 0x58,
  0x59, 0x40, 0x41, 0x18, 0x42, 0x15, 0x5b, 0x56, 0x5d, 0x5e, 0x5f, 0x17, 0x4e, 0x4f, 0x50, 0x51, 0x54, 0x55, 0x5a,
  0x13, 0x39, 0x47, 0x48, 0x49, 0x46, 0x4c, 0x12, 0x52, 0x4a, 0x53, 0x57, 0x16, 0x3a, 0x3c, 0x2d, 0x2c, 0x2f, 0x3b,
  0x2e, 0x14, 0x33, 0x35, 0x36, 0x37, 0x38, 0x5c, 0x11, 0x09, 0x0a, 0x0b, 0x1b, 0x06,
];

export const levelsWithoutExit = [0x06, 0x28];

export const levelsWithExit = levelOrder.filter((x) => !levelsWithoutExit.includes(x));
