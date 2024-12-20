import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MotiView } from "moti"; // Ensure you have Moti installed
import { ScreenSize } from "@/lib/poker";

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
  const purpleChipsCount = Math.floor(amountInBigBlinds / 50); // 25BB
  const blackChipsCount = Math.floor((amountInBigBlinds % 50) / 15); // 10BB
  const blueChipsCount = Math.floor((amountInBigBlinds % 15) / 5); // 5BB
  const yellowChipsCount = Math.floor((amountInBigBlinds % 5) / 2); // 2BB
  const redChipsCount = Math.floor((amountInBigBlinds % 2) / 0.5); // 0.5BB

  const renderChips = (count: number, image: any, alt: string) => {
    const chipsPerStack = 4;
    const stacks = Math.ceil(count / chipsPerStack);

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

  const value = formatValue();

  return (
    <View style={[styles.container, style]}>
      {/* Here are the chips in the center of the pot */}
      {isMovingToPot === 0 && (
        <>
          {renderChips(purpleChipsCount, typedCoinPurple, "coinpurple")}
          {renderChips(blackChipsCount, typedCoinBlack, "coinblack")}
          {renderChips(blueChipsCount, typedCoinBlue, "coinblue")}
          {renderChips(yellowChipsCount, typedCoinYellow, "coinyellow")}
          {renderChips(redChipsCount, typedCoinRed, "coinred")}
          {value !== "0 BB" && (
            <Text style={styles.valueText}>{value}</Text>
          )}
        </>
      )}

      {/* Handle other cases for animation here */}
      {/* Example for moving chips */}
      {isMovingToPot === 1 && (
        <MotiView
          style={styles.movingContainer}
          animate={{ left: "0%", top: "0%" }} // Adjust based on desired animation
          transition={{ duration: 0.3, type: "spring", stiffness: 50 }}
          onAnimationComplete={onAnimationDone}
        >
          {renderChips(purpleChipsCount, typedCoinPurple, "coinpurple")}
          {renderChips(blackChipsCount, typedCoinBlack, "coinblack")}
          {renderChips(blueChipsCount, typedCoinBlue, "coinblue")}
          {renderChips(yellowChipsCount, typedCoinYellow, "coinyellow")}
          {renderChips(redChipsCount, typedCoinRed, "coinred")}
        </MotiView>
      )}
    </View>
  );
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
