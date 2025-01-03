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
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const purpleChipsCount = Math.floor(amountInBigBlinds / 50); // 25BB
  const blackChipsCount = Math.floor((amountInBigBlinds % 50) / 15); // 10BB
  const blueChipsCount = Math.floor((amountInBigBlinds % 15) / 5); // 5BB
  const yellowChipsCount = Math.floor((amountInBigBlinds % 5) / 2); // 2BB
  const redChipsCount = Math.floor((amountInBigBlinds % 2) / 0.5); // 0.5BB

  const renderChips = (
    count: number, 
    image: any, 
    alt: string,
    zIndexBase: number,
  ) => {
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
                style={[styles.chipImage, {zIndex: zIndexBase - stackIndex*chipsPerStack -chipIndex, top: 3*chipIndex}]}
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
          top: "70%",
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
              textAlign: 'center', fontSize: 18, color: 'white', marginLeft: 25,
            }}>
            {value}
          </Text>
        )}
      </MotiView>
    );
    case 1:
      return (
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
          animate={{ left: "0%", top: "0%" }} // Adjust based on desired animation
          transition={{ duration: 0.3, type: "spring", stiffness: 50 }}
          onAnimationComplete={() => {
            if (onAnimationDone) {
              onAnimationDone();
            }
          }}
        >
          {renderChips(purpleChipsCount, typedCoinPurple, "coinpurple", 50)}
          {renderChips(blackChipsCount, typedCoinBlack, "coinblack", 40)}
          {renderChips(blueChipsCount, typedCoinBlue, "coinblue", 30)}
          {renderChips(yellowChipsCount, typedCoinYellow, "coinyellow", 20)}
          {renderChips(redChipsCount, typedCoinRed, "coinred", 10)}
        </MotiView>
      );
      case 2: // moving from pot to winner
        return (
          <MotiView
            style={{
              flexDirection: "column-reverse",
              alignItems: "flex-start",
            }}
          >
            {renderChips(purpleChipsCount, typedCoinPurple, "coinpurple", 50)}
            {renderChips(blackChipsCount, typedCoinBlack, "coinblack", 40)}
            {renderChips(blueChipsCount, typedCoinBlue, "coinblue", 30)}
            {renderChips(yellowChipsCount, typedCoinYellow, "coinyellow", 20)}
            {renderChips(redChipsCount, typedCoinRed, "coinred", 10)}
          </MotiView>          
        );
  }
  return null;

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
    // position: 'absolute'
  },
  chipStack: {
    marginRight: 8,
    // flexDirection: "column",
    // justifyContent: "flex-end",
  },
  chipImage: {
    width: 20,
    height: 20,
    marginTop:-10,
    position: 'absolute',
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
