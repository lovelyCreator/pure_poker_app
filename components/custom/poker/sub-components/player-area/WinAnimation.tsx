import { AnimatePresence, MotiView } from "moti";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface WinAnimationProps {
  isVisible: boolean;
  playSoundEnabled: boolean;
  amountWon: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ isVisible, playSoundEnabled, amountWon }) => {
  useEffect(() => {
    if (isVisible && playSoundEnabled) {
      const winnerSoundUrl = require("@/public/sounds/winnerSound.mp3");
      const winnerAudio = new Audio(winnerSoundUrl);

      const timer = setTimeout(() => {
        winnerAudio.play().catch((error) => {
          console.error("Error playing winner sound:", error);
        });
      }, 1000); // 1-second delay
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const formattedAmount = `+${(amountWon / 100).toFixed(2)}`;
  const numberOfDigits = formattedAmount.replace(/[^0-9]/g, "").length;
  
  const fontSizeClass = 
    numberOfDigits <= 4
    ? {fontSize: 14, top: 34, left: 4}
    : numberOfDigits <= 6
    ? {fontSize: 13, top: 32, left: 4}
    : {fontSize: 11, top: 33, left: 2}
  
  return (
    <>
    {
      isVisible && (
        <AnimatePresence>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            transition={{ type: 'timing', duration: 800, easing: (t) => t }}
            style ={[fontSizeClass, styles.container, styles.box]}
          >
            <Text style={styles.text}>
              {formattedAmount}
            </Text>
          </MotiView>
        </AnimatePresence>
      )
    }
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 44,
    zIndex: 10,
    left: 10
  },
  box: {
    width: 80,
    backgroundColor: 'rgba(34, 197, 94, 0.8)', // Equivalent to bg-gradient-to-r from-green-400 to-green-600
    borderRadius: 8,
    opacity: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: 'rgba(34, 197, 94, 0.8)',
    borderWidth: 2
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WinAnimation;
