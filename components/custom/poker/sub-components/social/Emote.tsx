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
          isText ? styles.textContainer : styles.largeTextContainer,
          isText && { borderColor: '#5f5f5f', borderWidth: 2, width: 60, }
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
    position: 'absolute',
    transform: [{ translateX: '50%' }],
    zIndex: 20,
  },
  textContainer: {
    right: -55, // Equivalent to -right-[95px]
    backgroundColor: '#2c2f36',
    paddingHorizontal: 12, // Equivalent to px-3
    paddingVertical: 4, // Equivalent to py-1
    borderRadius: 4, // Equivalent to rounded-md
  },
  largeTextContainer: {
    right: -30, // Equivalent to -right-[30px]
    top: 10, // Equivalent to top-[10px]
  },
  text: {
    color: '#ffffff', // Equivalent to text-white
    fontSize: 12, // Equivalent to text-sm
  },
  emote: {
    color: '#ffffff', // Equivalent to text-white
    fontSize: 40, // Equivalent to text-5xl
  },
});

export default Emote;
