import React from "react";
import { TextInput, View, StyleSheet } from "react-native";

const inputVariants = {
  default: {
    display: 'flex',
    backgroundColor: "#ffffff0d",
    borderColor: '#414a60', // border color
    borderWidth: 2,
    height: 40,
    width: "100%", // This is acceptable as a string for percentage
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#fff',
  },
};

export interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  variant?: "default";
  asChild?: boolean;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, variant = "default", placeholder, ...props }, ref) => {
    const variantStyle = inputVariants[variant];
    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          style={[variantStyle, style]} // Combine styles
          placeholder={placeholder}
          placeholderTextColor={styles.placeholder.color}
          {...props}
        />
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  fileInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: '500', // Medium weight
  },
  placeholder: {
    color: '#9ca3af', // Example muted color
  },
  focus: {
    borderWidth: 2,
    borderColor: '#63b3ed', // Example ring color
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});

export { Input };