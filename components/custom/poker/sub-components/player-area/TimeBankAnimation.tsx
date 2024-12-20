import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface TimeBankProps {
  setShowTimeBankAnimation: (value: boolean) => void;
}

const TimeBankAnimation: React.FC<TimeBankProps> = ({ setShowTimeBankAnimation }) => {
  const translateX = new Animated.Value(100); // Start off-screen
  const opacity = new Animated.Value(0); // Start invisible
  const scale = new Animated.Value(0.8); // Start scaled down

  useEffect(() => {
    const animateSequence = async () => {
      try {
        // Animate entry
        await new Promise((resolve) => {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 1, // Move to 1% position
              stiffness: 100,
              damping: 20,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(resolve);
        });

        // Pause in the center
        await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds pause

        // Animate exit
        await new Promise((resolve) => {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: -100, // Move off-screen
              stiffness: 100,
              damping: 20,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(resolve);
        });

        // Hide the component after the animation is done
        setShowTimeBankAnimation(false);
      } catch (error) {
        console.error("Animation sequence error:", error);
      }
    };

    // Start the animation sequence
    animateSequence();
  }, [setShowTimeBankAnimation, translateX, opacity, scale]);

  const animatedStyle = {
    transform: [
      { translateX },
      { scale },
    ],
    opacity,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>+30s Added!</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 50,
    backgroundColor: "transparent",
  },
  messageContainer: {
    backgroundColor: "red",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  messageText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins", // Ensure this font is loaded in your project
  },
});

export default TimeBankAnimation;
