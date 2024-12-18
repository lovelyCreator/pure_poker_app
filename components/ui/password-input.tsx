import React, { forwardRef, useState } from 'react';
import {View, TextInput, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import { Input } from '@/components/ui/input';
import type { InputProps } from '@/components/ui/input';
import { Button } from './button';

const PasswordInput = forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const disabled =
      props.value === "" || props.value === undefined || props.disabled;

    // const handleTogglePasswordVisibility = () => {
    //   setShowPassword((prev) => !prev);
    // };

    return (
      <View style={styles.container}>
        <Input
          secureTextEntry={showPassword ? false : true}
          style={styles.input}
          ref={ref}
          placeholder='**********'
          {...props}
        />
        <TouchableOpacity
          style={[styles.button, isHovered && styles.buttonHovered, styles.ghost, styles.sm]}
          onPress={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          <Image
            source={showPassword ? require('@/assets/sign-in/eye.png') : require('@/assets/sign-in/eye-off.png')}
            style={styles.icon}
            accessible={true}
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
    cursor: 'pointer',
    paddingRight: 10,
    borderRadius: 24
  },
  button: {
    position: 'absolute',
    right: 10,
    top: 18,
    height: '100%',
    paddingRight: 3,
    paddingLeft: 3,
    paddingTop: 2,
    paddingBottom: 2,
  },
  buttonHovered: {
    backgroundColor: 'transparent', // Change to transparent on hover
  },
  icon: {
    height: 15,
    width: 15,
    opacity: 10,
    resizeMode: 'contain'
  },
  srOnly: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    height: 36, // h-9
    paddingHorizontal: 12, // px-3
  },
});

export { PasswordInput };
