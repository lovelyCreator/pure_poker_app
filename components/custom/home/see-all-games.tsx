import React from "react";
import AvailableGamesHome from "./available-games";
import { AvailableGame } from "@/types/poker";
import { View, StyleSheet } from "react-native";

interface SeeAllGamesProps {
  availableGames: AvailableGame[];
  userIsVerified: boolean;
}

const SeeAllGames: React.FC<SeeAllGamesProps> = ({ availableGames, userIsVerified }) => {
  return (
    <View style={styles.container}>
      {availableGames.map((game) => (
        <AvailableGamesHome
          key={game.gameId}
          availableGame={game}
          userIsVerified={userIsVerified}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      display: 'flex', // Flexbox layout
      flexDirection: 'row', // Row for grid layout
      flexWrap: 'wrap', // Allow wrapping for responsive grid
      gap: 16, // gap-4 (4 * 4px = 16px)
      maxHeight: 384, // max-h-96 (96 * 4px = 384px)
      overflowY: 'auto', // overflow-y-auto
    },
    item: {
      width: '100%', // 100% width for single column
      // Responsive styles for different screen sizes
    },
  });
export default SeeAllGames;