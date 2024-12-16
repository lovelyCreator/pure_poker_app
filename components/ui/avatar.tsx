import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';

interface AvatarProps {
  style?: ViewStyle; // Style prop for Avatar
  children?: React.ReactNode; // Children elements
}

const Avatar: React.FC<AvatarProps> = ({ style, children }) => {
  return (
    <View style={[styles.avatarContainer, style]}>
      {children}
    </View>
  );
};

const AvatarImage: React.FC<{ source: any; style?: ImageStyle }> = ({ source, style }) => {
  return (
    <Image
      source={source}
      style={[styles.avatarImage, style]}
      resizeMode="cover" // Ensure the image covers the avatar space
    />
  );
};

const AvatarFallback: React.FC<{ style?: ViewStyle; children?: React.ReactNode }> = ({ style, children }) => {
  return (
    <View style={[styles.avatarFallback, style]}>
      <Text style={styles.fallbackText}>{children || '??'}</Text>
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  avatarContainer: {
    height: 40, // Equivalent to h-10
    width: 40, // Equivalent to w-10
    borderRadius: 20, // Full rounding for circle
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  } as ViewStyle,
  avatarImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20, // Full rounding for circle
  } as ImageStyle,
  avatarFallback: {
    height: '100%',
    width: '100%',
    borderRadius: 20, // Full rounding for circle
    backgroundColor: '#e0e0e0', // Muted background color
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  fallbackText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666', // Text color for fallback
  } as TextStyle,
});

export { Avatar, AvatarImage, AvatarFallback };
