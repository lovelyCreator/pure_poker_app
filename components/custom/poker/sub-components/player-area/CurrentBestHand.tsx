import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface CurrentBestHandProps {
  currentBestHand: string;
  gameStage: string;
  shouldShowWin: boolean;
}

const CurrentBestHand: React.FC<CurrentBestHandProps> = ({ 
  currentBestHand, 
  gameStage, 
  shouldShowWin 
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (currentBestHand && currentBestHand.length && (gameStage !== "gameOver" || shouldShowWin)) {
      const timer = setTimeout(() => setShouldRender(true), 2000); // Wait 2 seconds
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [currentBestHand, gameStage, shouldShowWin]);

  if (!shouldRender) {
    return null; // Don't render anything if the delay hasn't passed or conditions aren't met
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {currentBestHand}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    bottom: -20, // Adjust as necessary
    transform: [{ translateX: -50 }, { translateY: 100 }],
    backgroundColor: 'rgba(128, 128, 128, 0.75)', // Gray with opacity
    borderRadius: 20,
    paddingHorizontal: 12, // Adjust padding as necessary
    paddingVertical: 8, // Adjust padding as necessary
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // For Android shadow
  },
  text: {
    textAlign: 'center',
    fontSize: 13, // Adjust font size as necessary
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CurrentBestHand;
