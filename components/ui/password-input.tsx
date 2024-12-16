import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';

const eyeIcon = require('@/assets/sign-in/eye.png'); // Adjust the path
const eyeOffIcon = require('@/assets/sign-in/eye-off.png'); // Adjust the path

interface PasswordInputProps {
  value?: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
  style?: object; // Additional styles
}

const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ value, disabled, onChangeText, style }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          style={[styles.input, style]}
          editable={!disabled}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleTogglePasswordVisibility}
          disabled={disabled}
        >
          <Image
            source={showPassword ? eyeIcon : eyeOffIcon}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.srOnly}>
            {showPassword ? 'Hide password' : 'Show password'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 40, // Space for the button
  },
  button: {
    position: 'absolute',
    right: 10,
    top: 10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
  },
  srOnly: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});

export { PasswordInput };
