import React from 'react';
import { Text, TouchableOpacity, TextStyle, StyleSheet } from 'react-native';

// Define props interface for Label component
interface LabelProps {
  className?: string;
  onPress?: () => void; // Optional onPress handler
  style?: TextStyle; // Style prop for Text
  disabled?: boolean; // Optional disabled prop
  children: any;
}

// Create Label component
const Label = React.forwardRef<Text, LabelProps>(
  ({ className, disabled = false, onPress, children, style, ...props }, ref) => {
    return (
      <TouchableOpacity onPress={disabled ? undefined : onPress} disabled={disabled}>
        <Text
          ref={ref}
          style={[styles.label, disabled && styles.disabled, style]} // Combine styles
          {...props}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
);

Label.displayName = 'Label'; // Set display name for debugging

// Define styles using StyleSheet
const styles = StyleSheet.create({
  label: {
    fontSize: 14, // Equivalent to text-sm
    fontWeight: '500', // Equivalent to font-medium
    lineHeight: 16, // Adjusted for leading-none
    opacity: 1, // Default opacity
  },
  disabled: {
    opacity: 0.7, // Styles for disabled state
  },
});

export { Label };