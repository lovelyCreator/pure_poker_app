import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Card from "../Card"; // Ensure Card component is implemented
import { Player, GameState } from "@/types/poker";

interface PlayerCardsProps {
  gameState: GameState;
  playerHand: string[];
  isCurrentPlayer: boolean;
  gameIsOver: boolean;
  player: Player;
  shouldShowWin: boolean;
  aggregateBestHand: string[] | null;
}

const PlayerCards: React.FC<PlayerCardsProps> = ({
  gameState,
  playerHand,
  isCurrentPlayer,
  gameIsOver,
  player,
  shouldShowWin,
  aggregateBestHand,
}) => {
  const isNoBetBombPot = gameState?.bombPotActive && !gameState.bombPotSettings.postFlopBetting;
  const shouldMakeCardsShowUp = isNoBetBombPot || gameState?.isBeginningOfTheHand;

  return (
    <View style={[styles.container, { left: player.position * 400 }]}>
      {gameState.playerCount > 1 &&
        playerHand.map((cardObj: string | null, index: number) => {
          const animatedValue = new Animated.Value(shouldMakeCardsShowUp ? 0 : 1);

          // Start animation
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            delay: index === 0 ? 1300 : 1600,
            useNativeDriver: true,
          }).start();

          return (
            <Animated.View
              key={`${index}-${gameState?.gameStage}`} // Ensures re-render when condition changes
              style={{
                opacity: animatedValue,
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              }}
            >
              <Card
                index={index}
                card={cardObj ?? null}
                side={index === 0 ? "left" : "right"}
                isCurrentPlayer={isCurrentPlayer}
                gameIsOver={gameIsOver}
                hasFolded={!player.inHand}
                handDescription={player.handDescription}
                bestHand={aggregateBestHand}
                showCards={player.showCards}
                shouldShowWin={shouldShowWin}
              />
            </Animated.View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 26, // Adjust as needed for your layout
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayerCards;
