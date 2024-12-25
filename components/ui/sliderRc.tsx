// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// interface TooltipSliderProps {
//   value: number;
//   children: React.ReactElement;
//   visible: boolean;
//   tipFormatter?: (value: number) => React.ReactNode;
// }

// const TooltipSlider: React.FC<TooltipSliderProps> = ({
//   value,
//   children,
//   visible,
//   tipFormatter = (val) => `${val}`,
//   ...restProps
// }) => {
//   const [sliderValue, setSliderValue] = useState(value);

//   useEffect(() => {
//     setSliderValue(value);
//   }, [value]);

//   const incrementValue = () => {
//     const newValue = Math.min(sliderValue + 1, max);
//     setSliderValue(newValue);
//     onChange && onChange(newValue);
//   };

//   const decrementValue = () => {
//     const newValue = Math.max(sliderValue - 1, min);
//     setSliderValue(newValue);
//     onChange && onChange(newValue);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={decrementValue} style={styles.button}>
//         <Text style={styles.buttonText}>-</Text>
//       </TouchableOpacity>
//       <View style={styles.valueContainer}>
//         <Text style={styles.valueText}>{tipFormatter(sliderValue/100)}</Text> {/* Use tipFormatter */}
//       </View>
//       <TouchableOpacity onPress={incrementValue} style={styles.button}>
//         <Text style={styles.buttonText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   valueContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 25,
//     backgroundColor: '#38D24A',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 10,
//   },
//   valueText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   button: {
//     width: 24,
//     height: 24,
//     backgroundColor: '#12571b',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

// export default TooltipSlider;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface HandleTooltipProps {
  value: number;
  children: React.ReactNode;
  visible: boolean;
  tipFormatter?: (val: number) => string;
}

export const HandleTooltip: React.FC<HandleTooltipProps> = (props) => {
  const {
    value,
    children,
    visible,
    tipFormatter = (val) => `${val}`,
  } = props;

  return (
    <View style={styles.container}>
      {children}
      {visible && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tipFormatter(value / 100)}</Text>
        </View>
      )}
    </View>
  );
};


interface TooltipSliderProps {
  tipFormatter?: (value: number) => React.ReactNode;
  max?: number;
  min?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const TooltipSlider: React.FC<TooltipSliderProps> = ({
  tipFormatter,
  max = 100,
  min = 1,
  value,
  onChange,
}) => {
  const range = max - min;

  const marks = {
    [min]: { style: { color: "#171921", fontSize: "1px" }, label: "|" }, // Start of the slider
    [Math.round(range * 0.25) + min]: {
      style: { color: "#171921", fontSize: "1px" },
      label: "|",
    },
    [Math.round(range * 0.5) + min]: {
      style: { color: "#171921", fontSize: "1px" },
      label: "|",
    },
    [Math.round(range * 0.75) + min]: {
      style: { color: "#171921", fontSize: "1px" },
      label: "|",
    },
    [Math.round(range * 0.97) + min]: {
      // it's not * 1 to give this appearance of connection
      style: { color: "#171921", fontSize: "1px" },
      label: "|",
    }, // End of the slider
  };


  let step = 1;
  if (min >= 10000) {
    step = 100;
  } else if (min >= 1000) {
    step = 10;
  }

  return (
    <View style={styles.tootipcontainer}>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        thumbTintColor="#38D24A"
        minimumTrackTintColor="#12571b"
        maximumTrackTintColor="#464A52"
        style={styles.slider}
        />
      {value !== undefined && (
        <HandleTooltip value={value} visible={true} tipFormatter={tipFormatter}>
          <View style={styles.tooltipWrapper} />
        </HandleTooltip>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: -50, // Adjust based on your layout
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  tootipcontainer: {
    alignItems: 'center',
    marginTop: 30,
    zIndex: 1000
  },
  slider: {
    width: '100%',
    height: 0,
  },
  tooltipWrapper: {
    position: 'absolute',
    top: 50, // Adjust based on your layout
    left: '50%',
    transform: [{ translateX: -50 }],
  },
});

export default TooltipSlider;