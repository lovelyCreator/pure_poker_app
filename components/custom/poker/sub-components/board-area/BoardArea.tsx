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
      transition={{ duration: 100, delay: 180 }}
      style={{width: '100%', height: '100%', display: 'flex'}}
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

      {gameState?.netWinners?.length > 0 && 
        <Pot
          // eslint-disable-next-line
          amountShown={(gameState?.pot! - allPlayersBet) / 100}
          // eslint-disable-next-line
          amountInBigBlinds={(gameState?.pot! - allPlayersBet) / initialBigBlind}
          // eslint-disable-next-line
          isMovingToPot={3}
          screenSize={screenSize}
          initialBigBlinds={initialBigBlind}
          displayBB={displayBB}
      />}
      {/* {screenSize !== "smallIphone" && (
        <ChipsAnimation
          players={Object.values(gameState?.players ?? {})}
          playerCount={gameState?.playerCount ?? 0}
          gameState={gameState ?? ({} as GameState)}
          key={`${gameState?.gameStage}`}
        />
      )} */}

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
            from={{ opacity: 0, translateY: -20 }} // Starting state
            animate={{
              opacity: previousCommunityCards.length <= gameState.communityCards.length ? 1 : 0,
              translateY: previousCommunityCards.length <= gameState.communityCards.length ? 0 : -20,
            }}
            transition={{
              type: 'timing',
              duration: 300,
              delay: i * 300, // Stagger animations
            }}
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
    position: 'absolute',  // Equivalent to absolute
    inset: 0,               // Equivalent to inset-0
    display: 'flex',               // Enables flexbox layout
    flexDirection: 'column', // Equivalent to flex-col
    alignItems: 'center',  // Equivalent to items-center
    justifyContent: 'center', // Equivalent to justify-center
    transform: [{ translateY: '10%' }], // Translates down by 10%
    height: '100%',
  },
  potContainer: {
    position: 'relative',
    left: 0,
    bottom: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFC700',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    // height: '100%'
  },
  potText: {
    fontSize: 12,
    color: "#FFC700",
  },
  potBold: {
    fontWeight: "bold",
  },
  potValue: {
    marginHorizontal: 4,
  },
  cardsContainer: {
    position: 'relative',
    left: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap:10,
    top: -10,
    maxWidth: 180

  },
});

export default BoardArea;
