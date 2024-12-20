import React from "react";
import { View, StyleSheet, Animated } from "react-native";

interface PlayerTimeBarProps {
  timeBarWidth: number; // Width as a percentage (0 to 100)
  hasExtraTime: boolean; // Indicates if extra time is available
}

const PlayerTimeBar: React.FC<PlayerTimeBarProps> = ({
  timeBarWidth,
  hasExtraTime,
}) => {
  const animatedWidth = new Animated.Value(0);

  // Start the animation when the component mounts
  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: timeBarWidth,
      duration: 16, // Duration in milliseconds
      useNativeDriver: false, // Set to false as we are animating width
    }).start();
  }, [timeBarWidth]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.timeBar,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: hasExtraTime
              ? "rgba(255, 215, 0, 1)" // Gold for extra time
              : "rgba(59, 130, 246, 1)", // Blue otherwise
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0.5,
    height: 8,
    width: 76, // Adjust width as needed
    borderRadius: 10,
    backgroundColor: "#D1D5DB", // Gray background
    overflow: "hidden",
  },
  timeBar: {
    height: "100%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default PlayerTimeBar;
