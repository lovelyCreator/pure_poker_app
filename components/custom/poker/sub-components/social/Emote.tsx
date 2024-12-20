import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView, AnimatePresence } from "moti";

interface EmoteProps {
  emote: string | null;
  isVisible: boolean;
}

const Emote: React.FC<EmoteProps> = ({ emote, isVisible }) => {
  if (!emote) return null;

  const isText = emote.length > 2;
  const hasSpecialMovement = emote === "Nice Move!" || emote === "Well Played!";
  const topPosition = hasSpecialMovement ? -30 : -10;

  return (
    <AnimatePresence>
      {isVisible && (
        <MotiView
          style={[
            styles.container,
            {
              right: isText ? -95 : -30,
              top: topPosition,
            },
          ]}
          from={{
            opacity: 0,
            scale: 0.5,
            rotate: isText ? '0deg' : '-10deg',
          }}
          animate={{
            opacity: 1,
            scale: 1.2,
            rotate: isText ? '0deg' : '5deg',
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            rotate: '10deg',
          }}
          transition={{
            type: 'timing',
            duration: 400,
          }}
        >
          <Text style={isText ? styles.text : styles.emote}>
            {emote}
          </Text>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    backgroundColor: "#2c2f36",
    color: "white",
    fontSize: 14,
    padding: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#5f5f5f",
    textAlign: "center",
    width: 100,
  },
  emote: {
    fontSize: 40,
    color: "white",
  },
});

export default Emote;
