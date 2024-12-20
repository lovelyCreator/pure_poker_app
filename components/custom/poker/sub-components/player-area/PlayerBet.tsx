import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { motion } from "framer-motion"; // Note: Framer Motion is not available in React Native, so we'll simulate the animation differently.
import { getBettingAndDealerPositions, ScreenSize } from "@/lib/poker";
import type { GameState, Player as PlayerType } from "@/types/poker";
import Pot from "../board-area/Pot"; // Ensure Pot component is implemented

interface PlayerBetProps {
  player: PlayerType;
  gameState: GameState;
  rotatedPosition: number;
  screenSize: ScreenSize;
  displayBB: boolean;
  initialBigBlind: number;
}

const PlayerBet: React.FC<PlayerBetProps> = ({
  player,
  gameState,
  rotatedPosition,
  screenSize,
  initialBigBlind,
  displayBB,
}) => {
  if (!(player.bet > 0 && gameState.gameInProgress)) return null;

  const bettingAndDealerPositions = getBettingAndDealerPositions(screenSize);

  const { left, top } =
    bettingAndDealerPositions[gameState.players.length - 1]?.[rotatedPosition]
      ?.betPosition || { left: 0, top: 0 }; // Default values for position

  const formatValue = (): string => {
    if (displayBB) {
      const amountInBB = player.bet / initialBigBlind;
      const formattedBB = parseFloat((amountInBB * 100).toFixed(2));
      return `${formattedBB} BB`;
    } else {
      const formattedChips = new Intl.NumberFormat("en-US").format(player.bet);
      return formattedChips;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { left: left, top: top },
      ]}
    >
      <View style={styles.betDisplay}>
        <Text style={styles.betText}>
          {formatValue()}
        </Text>
        <View style={styles.potContainer}>
          <Pot
            amountShown={player.bet}
            amountInBigBlinds={(player.bet * 100) / initialBigBlind}
            isMovingToPot={1}
            screenSize={screenSize}
            initialBigBlinds={initialBigBlind}
            displayBB={displayBB}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 20,
    width: 80, // Adjust width as necessary
    alignItems: "center",
  },
  betDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  betText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16, // Adjust font size as necessary
    textAlign: "center",
  },
  potContainer: {
    flexShrink: 0,
  },
});

export default PlayerBet;
