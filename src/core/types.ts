export type GameId = "sliding-puzzle" | "snake" | "memory-match" | "2048";

/**
 * Core interface for mini-game definitions in Gamelet.
 */
export interface GameMetadata {
  id: GameId | string;
  name: string;
  description: string;
  icon?: string;
  badgeLabel?: string; // e.g. "M:" for Moves, "S:" for Score
}

/**
 * Standard widget layout metrics for Gamelet's compact 260x295 window.
 */
export const WIDGET_METRICS = {
  windowWidth: 260,
  windowHeight: 295,
  boardSize: 246,
  tileGap: 4,
  tilePadding: 4,
} as const;
