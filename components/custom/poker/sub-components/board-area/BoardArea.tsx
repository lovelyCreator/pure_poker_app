import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MotiView } from "moti"; // Ensure you have Moti installed
import Card from "../Card";
import CardEmpty from "../CardEmpty";
import Pot from "./Pot";
import { GameState } from "@/types/poker";
import { getAllPlayersBet, ScreenSize } from "@/lib/poker";
import ChipsAnimation from "../animations/ChipsAnimation";

interface BoardAreaProps {
  gameState: GameState;
  aggregateBestHand: string[] | null;
  setAllBoardCardsRevealed: (value: boolean) => void;
  previousCommunityCards: string[];
  shouldShowWin: boolean;
  cardVariants: any; // Adjust type as necessary
  screenSize: ScreenSize;
  displayBB: boolean;
  initialBigBlind: number;
}

const BoardArea: React.FC<BoardAreaProps> = ({
  gameState,
  aggregateBestHand,
  setAllBoardCardsRevealed,
  previousCommunityCards,
  shouldShowWin,
  cardVariants,
  screenSize,
  displayBB,
  initialBigBlind,
}) => {
  const showPot = !!(gameState?.pot && gameState.pot > 0);
  const allPlayersBet = getAllPlayersBet(gameState?.players ?? []);

  const formatDisplayValue = (amount: number): string => {
    if (displayBB) {
      const bbValue = amount / initialBigBlind;
      const formattedBB = parseFloat(bbValue.toFixed(2));
      return `${formattedBB} BB`;
    } else {
      const chipsValue = new Intl.NumberFormat("en-US").format(amount / 100);
      return chipsValue;
    }
  };

  return (
    <MotiView
      key={`-${gameState?.isBeginningOfTheHand}-${gameState?.gameOverTimeStamp}`}
      from={{ opacity: gameState?.isBeginningOfTheHand ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.8 }}
    >
      {/* Pot Information */}
      {gameState?.netWinners?.length === 0 && (
        <Pot
          amountShown={(gameState?.pot! - allPlayersBet) / 100}
          amountInBigBlinds={(gameState?.pot! - allPlayersBet) / initialBigBlind}
          isMovingToPot={0}
          screenSize={screenSize}
          initialBigBlinds={initialBigBlind}
          displayBB={displayBB}
        />
      )}

      {screenSize !== "smallIphone" && (
        <ChipsAnimation
          players={Object.values(gameState?.players ?? {})}
          playerCount={gameState?.playerCount ?? 0}
          gameState={gameState ?? ({} as GameState)}
          key={`${gameState?.gameStage}`}
        />
      )}

      <View style={styles.container}>
        {/* Total Pot Display */}
        {showPot && (
          <View style={styles.potContainer}>
            <Text style={styles.potText}>
              <Text style={styles.potBold}>Total Pot:</Text>
              <Text style={styles.potValue}>
                {formatDisplayValue(gameState.pot)}
              </Text>
            </Text>
          </View>
        )}

        {/* Community Cards */}
        <View style={styles.cardsContainer}>
          {gameState?.communityCards.map((card, i) => (
            <MotiView
              key={i}
              custom={i}
              from={{ opacity: 0 }}
              animate={
                previousCommunityCards.length <= gameState.communityCards.length
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => {
                if (i === gameState?.communityCards.length - 1) {
                  console.log("Animation is over, setting allBoardCardsReveal to true.");
                  setAllBoardCardsRevealed(true);
                }
              }}
            >
              <Card
                index={i}
                card={card}
                boardCard={true}
                side="none"
                isCurrentPlayer={false}
                gameIsOver={gameState.gameStage === "gameOver"}
                hasFolded={false}
                handDescription={null}
                bestHand={aggregateBestHand}
                shouldShowWin={shouldShowWin}
              />
            </MotiView>
          ))}

          {/* PreFlop: 3 Empty Cards */}
          {gameState?.gameStage === "preFlop" &&
            Array.from({ length: 3 }).map((_, i) => <CardEmpty key={i} />)}

          {/* Flop or Turn: 1 Empty Card */}
          {(gameState?.gameStage === "flop" ||
            gameState?.gameStage === "turn") && <CardEmpty />}
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  potContainer: {
    position: "absolute",
    bottom: '10%', // Adjust based on your layout
    left: 0,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFC700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional for better visibility
  },
  potText: {
    fontSize: 12,
    color: "#FFC700",
  },
  potBold: {
    fontWeight: "bold",
  },
  potValue: {
    marginLeft: 5,
  },
  cardsContainer: {
    position: "absolute",
    top: '-15%', // Adjust based on your layout
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BoardArea;
