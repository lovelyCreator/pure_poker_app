import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Card from "../Card"; // Ensure Card component is implemented
import { Player, GameState } from "@/types/poker";
import { MotiView } from "moti";

interface PlayerCardsProps {
  gameState: GameState;
  playerHand: string[];
  isCurrentPlayer: boolean;
  gameIsOver: boolean;
  player: Player;
  shouldShowWin: boolean;
  aggregateBestHand: string[] | null;
  totalPlayerCount: number;
}

const PlayerCards: React.FC<PlayerCardsProps> = ({
  gameState,
  playerHand,
  isCurrentPlayer,
  gameIsOver,
  player,
  shouldShowWin,
  aggregateBestHand,
  totalPlayerCount
}) => {
  const isNoBetBombPot = (gameState && gameState.bombPotActive && !gameState.bombPotSettings.postFlopBetting) ?? false;
  const shouldMakeCardsShowUp = isNoBetBombPot || gameState?.isBeginningOfTheHand;
  console.log('totalPlayeCount', totalPlayerCount)
  return (
    <View style={[styles.container, 
      isCurrentPlayer ? {left: 105, top: 60} : 
      player.position < totalPlayerCount/2 ?
      {left: -10, top: 25}
      :
      {left: 50, top: 25}
    ]}>
      {gameState.playerCount > 1 &&
        playerHand.map(
          (cardObj: string | null, index: number) => (
            <MotiView
              key={`${index}-${gameState?.gameStage}`}
              from={{ opacity: shouldMakeCardsShowUp ? 0 : 1,
                scale: shouldMakeCardsShowUp ? 0.7 : 1
              }}
              animate={{
                opacity:  1,
                scale: 1
              }}
              transition={{
                duration: 0.8,
                delay: index === 0 ? 2000 : 2300,
              }}
            >
              <Card
                key={index}
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
                isDealing = {false}
              />              
            </MotiView>
          )
          //   {
          // const animatedValue = new Animated.Value(shouldMakeCardsShowUp ? 0 : 1);

          // // Start animation
          // Animated.timing(animatedValue, {
          //   toValue: 1,
          //   duration: 800,
          //   delay: index === 0 ? 1300 : 1600,
          //   useNativeDriver: true,
          // }).start();

          // return (
          //   <Animated.View
          //     key={`${index}-${gameState?.gameStage}`} // Ensures re-render when condition changes
          //     style={{
          //       opacity: animatedValue,
          //       transform: [
          //         {
          //           scale: animatedValue.interpolate({
          //             inputRange: [0, 1],
          //             outputRange: [0.7, 1],
          //           }),
          //         },
          //       ],
          //     }}
          //   >
          //     <Card
          //       index={index}
          //       card={cardObj ?? null}
          //       side={index === 0 ? "left" : "right"}
          //       isCurrentPlayer={isCurrentPlayer}
          //       gameIsOver={gameIsOver}
          //       hasFolded={!player.inHand}
          //       handDescription={player.handDescription}
          //       bestHand={aggregateBestHand}
          //       showCards={player.showCards}
          //       shouldShowWin={shouldShowWin}
          //     />
          //   </Animated.View>
          // );
        // }
        )
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, // Adjust as needed for your layout
    left: -20,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    // zIndex: -1
  },
});

export default PlayerCards;
