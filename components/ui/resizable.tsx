import React, { useState } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ResizablePanelGroupProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
}

const ResizablePanelGroup: React.FC<ResizablePanelGroupProps> = ({
  children,
  direction = 'horizontal',
}) => {
  const [panelSizes, setPanelSizes] = useState<number[]>([height / 2, height / 2]);

  const handleResize = (index: number, dy: number) => {
    const newSizes = [...panelSizes];
    newSizes[index] += dy;
    newSizes[index + 1] -= dy;
    setPanelSizes(newSizes);
  };

  return (
    <View style={[styles.container, direction === 'vertical' ? styles.vertical : styles.horizontal]}>
      {React.Children.map(children, (child, index) => (
        <View style={{ height: panelSizes[index], width }}>
          {child}
          {index < children.length - 1 && (
            <ResizableHandle onResize={(dy) => handleResize(index, dy)} />
          )}
        </View>
      ))}
    </View>
  );
};

interface ResizableHandleProps {
  onResize: (dy: number) => void;
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({ onResize }) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      onResize(gestureState.dy);
    },
    onPanResponderRelease: () => {},
  });

  return (
    <View {...panResponder.panHandlers} style={styles.handle}>
      {/* Optional handle visual representation */}
      <View style={styles.handleIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Default to vertical
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
  },
  handle: {
    width: '100%',
    height: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleIndicator: {
    width: 30,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 3,
  },
});

export { ResizablePanelGroup, ResizableHandle };
