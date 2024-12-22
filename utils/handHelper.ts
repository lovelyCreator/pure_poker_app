import { type GameState } from "@/types/poker";

export function getAggregateBestHand(gameState: GameState): string[] {
  const winningHands = gameState.netWinners.flatMap((winnerId) => {
    const winner = gameState.players.find((player) => player && player.uuid === winnerId);
    // eslint-disable-next-line
    return winner?.bestHand || [];
  });

  // Remove duplicates if the same card is in multiple best hands
  const uniqueWinningHands = Array.from(
    new Set(winningHands.map((card) => card)),
  ).map((card) => card);
  
  return uniqueWinningHands;
}
