import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatePresence, MotiView } from 'moti'; // Use Moti for animations in React Native

// Define color mapping for moves
const moveStyles = {
  FOLD: { color: 'red', borderColor: 'red' },
  CALL: { color: 'yellow', borderColor: 'yellow' },
  CHECK: { color: 'yellow', borderColor: 'yellow' },
  RAISE: { color: 'green', borderColor: 'green' },
  BET: { color: 'green', borderColor: 'green' },
};

// Define the props for the component
interface LastMoveIndicatorProps {
  isLastMover: boolean;
  lastMove: 'FOLD' | 'CALL' | 'CHECK' | 'RAISE' | 'BET' | null;
}

const LastMoveIndicator: React.FC<LastMoveIndicatorProps> = ({ isLastMover, lastMove }) => {
  const [showMove, setShowMove] = useState(true);

  // Hide the last move after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMove(false);
    }, 1500); // 1.5-second delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [lastMove]);

  // Get the styles based on the last move performed, handling null case
  const moveStyle =
    lastMove && moveStyles[lastMove]
      ? moveStyles[lastMove]
      : { color: 'white', borderColor: 'gray' };

  return (
    <AnimatePresence>
      {isLastMover && lastMove && showMove && (
        <MotiView
          from={{ opacity: 0, translateY: 0 }} // Start invisible
          animate={{ opacity: 1, translateY: 0 }} // Fade in
          exit={{ opacity: 0 }} // Fade out
          transition={{ duration: 1200, type: 'timing' }} // Smooth easing
          style={[
            styles.container,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderColor: moveStyle.borderColor,
            },
          ]}
        >
          <Text style={[styles.text, { color: moveStyle.color }]}>
            {lastMove}
          </Text>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    width: 65, // Adjust width as necessary
    top: 30, // Adjust top position as necessary
    left: 10, // Adjust left position as necessary
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  text: {
    fontSize: 14, // Adjust text size as necessary
    textAlign: 'center',
  },
});

export default LastMoveIndicator;
