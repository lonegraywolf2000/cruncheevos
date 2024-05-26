export const possibleOffsets = [0, 0x2000, 0x4000, 0x6000, 0x8000, 0xa000, 0xc000, 0xe000];

export const baseAddress = {
  ballInHole: 0x003,
  /** Single player or not? 0 if single. */
  gameType: 0x00a,
  /** Current hole number. 1-indexed. */
  holeNumber: 0x100,
  /** Par for current hole. */
  parAmount: 0x101,
  /** Shots currently taken on this hole. */
  currentShots: 0x106,
  /** Current ball status? 1: Bunker */
  ballStatus: 0x140,
  powerBarSummary: 0x1b0,
  powerBar1: 0x1b4,
  powerBar2: 0x1b8,
  powerBar3: 0x1bc,
  soundByte: 0x664,
};
