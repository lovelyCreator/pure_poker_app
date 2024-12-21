import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AnimatePresence, MotiView } from "moti"; // Ensure you have Moti installed
import { generatePlayerPositions, ScreenSize } from "@/lib/poker";
import { GameState } from "@/types/poker";

// Importing PNG images using require
const typedCoinRed = require('@/assets/game/coin-red.png');
const typedCoinYellow = require('@/assets/game/coin-yellow.png');
const typedCoinBlue = require('@/assets/game/coin-blue.png');
const typedCoinBlack = require('@/assets/game/coin-black.png');
const typedCoinPurple = require('@/assets/game/coin-purpule.png');

interface PotProps {
  amountShown: number;
  amountInBigBlinds: number;
  style?: React.CSSProperties;
  isMovingToPot?: number;
  onAnimationDone?: () => void;
  screenSize: ScreenSize;
  displayBB: boolean;
  initialBigBlinds: number;
  gameState: GameState;
  currentPlayerPosition: number;
  index?: number;
  shouldShowWin?: boolean;
}

const Pot: React.FC<PotProps> = ({
  amountShown,
  amountInBigBlinds,
  style,
  isMovingToPot = 0,
  onAnimationDone,
  screenSize,
  initialBigBlinds,
  displayBB,
  gameState,
  currentPlayerPosition,
  index,
  shouldShowWin,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const purpleChipsCount = Math.floor(amountInBigBlinds / 50); // 25BB
  const blackChipsCount = Math.floor((amountInBigBlinds % 50) / 15); // 10BB
  const blueChipsCount = Math.floor((amountInBigBlinds % 15) / 5); // 5BB
  const yellowChipsCount = Math.floor((amountInBigBlinds % 5) / 2); // 2BB
  const redChipsCount = Math.floor((amountInBigBlinds % 2) / 0.5); // 0.5BB

  // const allInTotalPot = gameState.pot /10;
  // const allInPurpleChipsCount = Math.floor(allInTotalPot / 50); // 25BB
  // const allInBlackChipsCount = Math.floor((allInTotalPot % 50) / 15); // 10BB
  // const allInBlueChipsCount = Math.floor((allInTotalPot % 15) / 5); // 5BB
  // const allInYellowChipsCount = Math.floor((allInTotalPot % 5) / 2); // 2BB
  // const allInRedChipsCount = Math.floor((allInTotalPot % 2) / 0.5); // 0.5BB

  // const allInChipsDistribution = [
  //   {chipsCount: allInRedChipsCount, chipsType: typedCoinRed, chipName: "coinred", zIndex: 10, chipIndex: 1 },
  //   {chipsCount: allInYellowChipsCount, chipsType: typedCoinYellow, chipName: "coinyellow", zIndex: 20, chipIndex: 2 },
  //   {chipsCount: allInBlueChipsCount, chipsType: typedCoinBlue, chipName: "coinblue", zIndex: 30, chipIndex: 3 },
  //   {chipsCount: allInBlackChipsCount, chipsType: typedCoinBlack, chipName: "coinblack", zIndex: 40, chipIndex: 4 },
  //   {chipsCount: allInPurpleChipsCount, chipsType: typedCoinPurple, chipName: "coinpurple", zIndex: 50, chipIndex: 5 },
  // ]

  const getDelayedTime = (state: string): number => {
    switch (state) {
      case "preFlop":
        return 6;
      case "flop":
        return 3;
      case "turn":
        return 2;
      default:
        return 0;
    }
  }
  const [playerPositions, setPlayerPositions] = useState(generatePlayerPositions(screenSize));
  const renderChips = (count: number, image: any, alt: string,
    zIndexBase: number,) => {
      let chipsPerStack = 4;
      let stacks = Math.ceil(count / chipsPerStack);
      if (isMovingToPot !== 0) {
        stacks = 1;
        chipsPerStack = 9;
      }
  

    return (
      <View style={styles.chipContainer}>
        {Array.from({ length: stacks }).map((_, stackIndex) => (
          <View key={`${alt}-stack-${stackIndex}`} style={styles.chipStack}>
            {Array.from({
              length: Math.min(chipsPerStack, count - stackIndex * chipsPerStack),
            }).map((_, chipIndex) => (
              <Image
                key={`${alt}-${stackIndex}-${chipIndex}`}
                source={image}
                style={styles.chipImage}
                alt={alt}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const formatValue = (): string => {
    if (displayBB) {
      const formattedBB = parseFloat(amountInBigBlinds.toFixed(2));
      return `${formattedBB} BB`;
    } else {
      return amountShown > 0
        ? `${new Intl.NumberFormat("en-US").format(amountShown)}`
        : "";
    }
  };

  if (!isVisible) return null;

  switch (isMovingToPot) {
    case 0: 
    const value = formatValue();
    return (
      <MotiView
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          opacity: 1,
          left: "50%",
          top: "65%",
          transform: "translate(-50%, 100%)",
          ...style,
        }}
      >
        {/* Here are the chips in the center of the pot */}
        {renderChips(purpleChipsCount, typedCoinPurple, "coinpurple", 50)}
        {renderChips(blackChipsCount, typedCoinBlack, "coinblack", 40)}
        {renderChips(blueChipsCount, typedCoinBlue, "coinblue", 30)}
        {renderChips(yellowChipsCount, typedCoinYellow, "coinyellow", 20)}
        {renderChips(redChipsCount, typedCoinRed, "coinred", 10)}
        {value != "0 BB" && (
          <Text 
            style= {{
              marginTop: -15, textAlign: 'center', fontSize: 18, color: 'white'
            }}>
            {value}
          </Text>
        )}
      </MotiView>
    );
    case 1:
      return (
        gameState?.gameIsAllIn === "river" &&
        (
          <AnimatePresence>
            <MotiView
              style={{
                height: "30px",
                position: "relative", // Keep this to make it responsive to the parent container
                display: "flex",
                flexDirection: "column", // Ensure chips are stacked vertically (one pile)
                alignItems: "start", // Center the chips vertically
                justifyContent: "center", // Center the chips horizontally within the div
                ...style,
                translateX: "50%" // Apply any additional styles passed via props
              }}
            >
              {renderChips(purpleChipsCount, typedCoinPurple, "coinpurple", 50)}
              {renderChips(blackChipsCount, typedCoinBlack, "coinblack", 40)}
              {renderChips(blueChipsCount, typedCoinBlue, "coinblue", 30)}
              {renderChips(yellowChipsCount, typedCoinYellow, "coinyellow", 20)}
              {renderChips(redChipsCount, typedCoinRed, "coinred", 10)}
            </MotiView>
          </AnimatePresence>
        )
      );
      case 3: // moving from pot to winner
          return (
            gameState?.players.map((player, index) => (
              (gameState?.netWinners as string[]).includes(player.uuid) ?
                (
                  <AnimatePresence key={player.uuid}>
                    <View style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        left: "50%",
                        top: `${screenSize === "smallIphone" ? "65%" : "54%"}`,
                        transform: "translate(-50%, 100%)",
                        ...style,
                      }}>
                      {/* {allInChipsDistribution.map((chip, chipIndex) => (
                        <MotiView
                          animate={{
                            opacity: [1 , 0],
                            scale: [1, 1.5]
                          }}
                          transition={{
                            times: [0, 1],
                            duration: 0.2,
                            delay: 2 + chipIndex * 0.1 + getDelayedTime(gameState.gameIsAllIn),
                          }}
                          key={`${player.uuid}${chip.chipName}centerchips`}
                        >
                          {renderChips(chip.chipsCount, chip.chipsType, chip.chipName, chip.zIndex)}
                        </MotiView>
                      ))} */}
                    </View>
                    {/* {allInChipsDistribution.map((chip, chipIndex) => (
                      <MotiView
                        style={{
                          position: "absolute",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          left: "50%",
                          top: `${screenSize === "smallIphone" ? "65%" : "54%"}`,
                          ...style,
                        }}
                        animate={{
                          left: `${playerPositions[gameState?.playerCount - 1]?.[(index + gameState.players.length - currentPlayerPosition) % gameState.players.length]?.leftPosition}`,
                          top: `${playerPositions[gameState?.playerCount - 1]?.[(index + gameState.players.length - currentPlayerPosition) % gameState.players.length]?.topPosition}`,
                          opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                          duration: 0.3,
                          times: [0, 0.1, 0.9, 1],
                          delay: 2 + chipIndex * 0.1 + getDelayedTime(gameState.gameIsAllIn),
                          ease: "easeOut"
                        }}
                        key={`${player.uuid}${chip.chipName}`}
                      >
                        {renderChips(chip.chipsCount, chip.chipsType, chip.chipName, chip.zIndex)}
                      </MotiView>
                    ))} */}
                    
                  </AnimatePresence>
                ) : null
            ))
          );
  }

};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "50%",
    top: "47%", // Adjust based on your layout
    transform: [{ translateX: -50 }, { translateY: 100 }],
    flexDirection: "row",
    alignItems: "center",
  },
  chipContainer: {
    flexDirection: "row",
  },
  chipStack: {
    marginRight: 8,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  chipImage: {
    width: 20,
    height: 20,
    marginTop: -15,
  },
  valueText: {
    marginTop: -15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  movingContainer: {
    height: 30,
    position: "relative",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default Pot;
