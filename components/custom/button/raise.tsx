import React, { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button"; // Your custom button component
import { formatChipsOrBB } from "@/lib/poker"; // Ensure this function is available

interface RaiseProps {
  isBet?: boolean;
  raiseAmount: number;
  isGoingAllIn: boolean;
  displayBB: boolean;
  initialBigBlind: number;
  onPress: () => void; // Ensure onPress is included
}

const Raise = forwardRef<View, RaiseProps>(
  (
    { isBet, raiseAmount, isGoingAllIn, displayBB, initialBigBlind, onPress, ...props },
    ref,
  ) => {
    const displayValue = formatChipsOrBB(
      raiseAmount,
      displayBB,
      initialBigBlind,
    );

    return (
      <Button
        {...props}
        ref={ref}
        onPress={onPress}
        style={styles.button} // Add any additional styles here
      >
        <View style={styles.content}>
          {isBet ? (
            <>
              <Text style={styles.label}>Bet</Text>
              <Text style={styles.value}>{displayValue}</Text>
            </>
          ) : isGoingAllIn ? (
            <>
              <Text style={styles.label}>Raise to All In</Text>
              <Text style={styles.value}>{displayValue}</Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Raise to</Text>
              <Text style={styles.value}>{displayValue}</Text>
            </>
          )}
        </View>
      </Button>
    );
  },
);

Raise.displayName = "Raise";

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#37DD4A', // Change to your preferred color
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#178D25', // Text color
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#178D25', // Text color
  },
});

export default Raise;
