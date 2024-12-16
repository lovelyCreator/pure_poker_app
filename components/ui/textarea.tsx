import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export type TextareaProps = TextInputProps;

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        style={[styles.textarea, style]}
        multiline
        numberOfLines={4} // Adjust the number of lines as needed
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80, // Minimum height
    width: '100%', // Full width
    borderWidth: 1, // Border width
    borderColor: '#ccc', // Border color
    borderRadius: 8, // Rounded corners
    backgroundColor: '#fff', // Background color
    padding: 10, // Padding
    fontSize: 14, // Font size
    color: '#000', // Text color
  },
});

export {Textarea};
