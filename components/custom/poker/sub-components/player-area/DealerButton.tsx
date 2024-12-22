import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getBettingAndDealerPositions, ScreenSize } from "@/lib/poker"; // Adjust the import path as necessary
import type { GameState } from "@/types/poker";

interface DealerButtonProps {
  gameState: GameState;
  index: number;
  dealerIndex: number;
  rotatedPosition: number;
  screenSize: ScreenSize;
}

const DealerButton: React.FC<DealerButtonProps> = ({
  gameState,
  index,
  dealerIndex,
  rotatedPosition,
  screenSize
}) => {
  // Return null if the game is not in progress or if this is not the dealer's index
  if (!gameState.gameInProgress || index !== dealerIndex) return null;

  const bettingAndDealerPositions = getBettingAndDealerPositions(screenSize);
  
  // Get the button position based on the game state
  const { left = 0, top = 0 } = bettingAndDealerPositions[gameState.players.length - 1]?.[rotatedPosition]?.buttonPosition || {};
  
  return (
    <View
      style={[
        styles.button,
        {
          left: left+120 , // Adjusting for the 100% offset
          top: top + 150,    // Adjusting for the 50% offset
          transform: [{ translateX: -50 }, { translateY: -50 }],
        },
      ]}
    >
      <Text style={styles.text}>BTN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 26, // Adjust width as necessary
    height: 26, // Adjust height as necessary
    borderRadius: 13, // Half of width/height for a circular shape
    backgroundColor: '#1e84f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10, // Adjust font size as necessary
  },
});

export default DealerButton;
