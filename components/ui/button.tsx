import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'promote' | 'demote' | 'outline' | 'secondary' | 'ghost' | 'link' | 'raise' | 'create' | 'call' | 'check' | 'fold' | 'full' | 'empty' | 'home' | 'bet' | 'base';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean; // Not applicable in React Native but kept for compatibility
  children: React.ReactNode; // Children elements
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ variant = 'default', size = 'default', style, textStyle={}, children, ...props }, ref) => {
    const buttonStyle = [styles.button, styles[variant], styles[size], style];

    return (
      <TouchableOpacity ref={ref} style={buttonStyle} {...props}>
        <Text style={[styles.text, textStyle]}>{children}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

// Define styles using StyleSheet
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    transitionDuration: '200ms', // Not directly applicable in React Native
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  default: {
    backgroundColor: '#2085F0', // bg-primary
    color: '#FFFFFF', // text-primary-foreground
    height: 40, // h-10
    paddingHorizontal: 16, // px-4
  },
  destructive: {
    backgroundColor: '#EC274F', // bg-destructive
    color: '#FFFFFF', // text-destructive-foreground
  },
  promote: {
    backgroundColor: '#37DD4A',
    color: '#FFFFFF',
  },
  demote: {
    backgroundColor: '#FFD700',
    color: '#FFFFFF',
  },
  outline: {
    borderColor: '#2085F0', // border-input
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#6C757D', // bg-secondary
    color: '#FFFFFF', // text-secondary-foreground
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    color: '#2085F0', // text-primary
    textDecorationLine: 'underline',
  },
  raise: {
    backgroundColor: '#37DD4A',
    color: '#178D25',
  },
  create: {
    backgroundColor: '#37DD4A',
    color: '#178D25',
    borderRadius: 50,
  },
  call: {
    backgroundColor: '#FFD700',
    color: '#998220',
  },
  check: {
    backgroundColor: '#FFD700',
    color: '#998220',
  },
  fold: {
    backgroundColor: '#EC274F',
    color: '#76182B',
  },
  full: {
    backgroundColor: '#2085F0',
    borderRadius: 50,
  },
  empty: {
    backgroundColor: 'rgba(44, 50, 65, 0.5)',
    borderColor: '#2085F0',
    borderWidth: 2,
  },
  home: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2085F0',
    borderWidth: 2,
  },
  bet: {
    backgroundColor: 'rgba(33, 37, 48, 0.7)',
    color: '#FFFFFF',
    borderRadius: 16,
  },
  sm: {
    height: 36, // h-9
    paddingHorizontal: 12, // px-3
  },
  lg: {
    height: 44, // h-11
    paddingHorizontal: 32, // px-8
  },
  icon: {
    height: 40, // h-10
    width: 40, // w-10
  },
});

export { Button, ButtonProps };
