import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ScrollAreaProps {
  children: React.ReactNode;
  horizontal?: boolean;
  style?: object;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  horizontal = false,
  style,
}) => {
  return (
    <ScrollView
      horizontal={horizontal}
      contentContainerStyle={[styles.scrollView, style]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const ScrollBar: React.FC<{ orientation?: 'vertical' | 'horizontal' }> = ({ orientation }) => {
  return (
    <View style={[styles.scrollBar, orientation === 'vertical' ? styles.vertical : styles.horizontal]} />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderRadius: 8, // Adjust as needed for rounded corners
  },
  scrollBar: {
    backgroundColor: '#ccc', // Change to your desired color
    borderRadius: 5,
  },
  vertical: {
    width: 5,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  horizontal: {
    height: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export { ScrollArea, ScrollBar };
