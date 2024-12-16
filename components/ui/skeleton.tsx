import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = ({ style, ...props }) => {
  return (
    <View
      style={[styles.skeleton, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0', // Change this to your desired muted color
    borderRadius: 8, // Adjust as needed for rounded corners
    animationDuration: '1s',
    animationName: 'pulse',
    animationIterationCount: 'infinite',
    // For Android, you can use a workaround for animation
    // You might need to implement a custom animation using libraries like `react-native-reanimated`
  },
});

export { Skeleton };
