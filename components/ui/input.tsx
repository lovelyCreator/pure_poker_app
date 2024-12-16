import React from "react";
import { TextInput, View, StyleSheet } from "react-native";

const inputVariants = {
  default: {
    backgroundColor: "#ffffff0d",
    borderColor: "#ffffff4",
    borderWidth: 2,
    height: 40,
    width: "100%", // This is acceptable as a string for percentage
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
};

export interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  variant?: "default";
  asChild?: boolean;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, variant = "default", ...props }, ref) => {
    const variantStyle = inputVariants[variant];
    console.log(variantStyle);
    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          style={[variantStyle, style]} // Combine styles
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
});

export { Input };