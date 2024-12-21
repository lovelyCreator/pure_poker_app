import React, { forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";
import { chipsToBB } from "@/lib/poker"; // Ensure this function is available
import { Button } from "@/components/ui/button";

interface CallProps extends TouchableOpacityProps {
  amountToCall: number;
  goingAllIn: boolean;
  displayBB: boolean;
  initialBigBlind: number;
}

const Call = forwardRef<HTMLButtonElement, CallProps>(
  ({ amountToCall, goingAllIn, initialBigBlind, displayBB, ...props }, ref) => {
    const setDisplayValue = () => {
      if (displayBB) {
        const bbValue = chipsToBB(amountToCall, initialBigBlind);
        const formattedBB = parseFloat((bbValue / 100).toFixed(2));
        return `${formattedBB} BB`;
      } else {
        const chipsValue = new Intl.NumberFormat("en-US").format(amountToCall / 100);
        return chipsValue;
      }
    };

    const displayValue = setDisplayValue();

    return (
        <Button
          variant="call"
          {...props}
          ref={ref}
          style={styles.button}
      >
        <Text style={styles.title}>Call{'\n'}</Text>
        {goingAllIn ? (
          <Text style={styles.subtitle}>To All In</Text>
        ) : (
          <Text style={styles.subtitle}>{displayValue}</Text>
        )}
      </Button>
    );
  },
);

Call.displayName = "Call";

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 100,
    borderRadius: 15,
    backgroundColor: '#FFAF05', // Change to your preferred color
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16, // Adjust size as needed
    color: '#998220', // Text color
    textAlign: 'center'
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16, // Adjust size as needed
    color: '#998220', // Text color
    textAlign: 'center'
  },
});

export default Call;
