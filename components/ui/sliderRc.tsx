import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TooltipSliderProps {
  max?: number;
  min?: number;
  value?: number;
  onChange?: (value: number) => void;
  tipFormatter?: (value: number) => string; // Add tipFormatter prop
}

const TooltipSlider: React.FC<TooltipSliderProps> = ({
  max = 100,
  min = 1,
  value = min,
  onChange,
  tipFormatter = (val) => `${val}`, // Default formatter
}) => {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const incrementValue = () => {
    const newValue = Math.min(sliderValue + 1, max);
    setSliderValue(newValue);
    onChange && onChange(newValue);
  };

  const decrementValue = () => {
    const newValue = Math.max(sliderValue - 1, min);
    setSliderValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrementValue} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{tipFormatter(sliderValue/100)}</Text> {/* Use tipFormatter */}
      </View>
      <TouchableOpacity onPress={incrementValue} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  valueContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#38D24A',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  valueText: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    width: 24,
    height: 24,
    backgroundColor: '#12571b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TooltipSlider;
