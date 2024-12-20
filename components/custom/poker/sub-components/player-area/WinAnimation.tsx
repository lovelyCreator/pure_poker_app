import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface WinAnimationProps {
  isVisible: boolean;
  playSoundEnabled: boolean;
  amountWon: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ isVisible, playSoundEnabled, amountWon }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      if (playSoundEnabled) {
        const winnerSoundUrl = require("@/public/sounds/winnerSound.mp3"); // Adjust the path as needed
        const winnerAudio = new Audio(winnerSoundUrl);

        const timer = setTimeout(() => {
          // Play sound when the winner is announced after a 1-second delay
          winnerAudio.play().catch((error) => {
            console.error("Error playing winner sound:", error);
          });
        }, 1000); // 1-second delay

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, playSoundEnabled]);

  const formattedAmount = `+${(amountWon / 100).toFixed(2)}`;
  const numberOfDigits = formattedAmount.replace(/[^0-9]/g, "").length;

  // Determine font size based on number of digits
  const fontSize = numberOfDigits <= 4 ? 24 : numberOfDigits <= 6 ? 20 : 16;

  return (
    <>
      {isVisible && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={[styles.amountText, { fontSize }]}>
            {formattedAmount}
          </Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    top: 34, // Adjust as needed
    left: 10, // Adjust as needed
    width: 100, // Adjust as needed
    backgroundColor: "rgba(34, 197, 94, 0.8)", // Equivalent to bg-opacity-80
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#38a169", // Equivalent to border-green-500
  },
  amountText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WinAnimation;
