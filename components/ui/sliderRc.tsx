import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider'; // Use the appropriate slider library for React Native

interface HandleTooltipProps {
  value: number;
  visible: boolean;
  tipFormatter?: (value: number) => React.ReactNode;
}

const HandleTooltip: React.FC<HandleTooltipProps> = ({ value, visible, tipFormatter = (val) => `${val}` }) => {
  return (
    <View style={styles.tooltipContainer}>
      {visible && (
        <Text style={styles.tooltipText}>{tipFormatter(value)}</Text>
      )}
    </View>
  );
};

interface TooltipSliderProps {
  max?: number;
  min?: number;
  tipFormatter?: (value: number) => React.ReactNode;
  onValueChange: (value: number) => void;
  value: number;
}

const TooltipSlider: React.FC<TooltipSliderProps> = ({
  max = 100,
  min = 1,
  tipFormatter,
  onValueChange,
  value,
}) => {
  const range = max - min;

  return (
    <View style={styles.sliderContainer}>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#12571b"
        maximumTrackTintColor="#464A52"
        thumbTintColor="#38D24A"
      />
      <HandleTooltip value={value} visible={true} tipFormatter={tipFormatter} />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
  },
  tooltipText: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export { TooltipSlider };
