import { StyleSheet, Image, Platform, ScrollView, Text, View, TextInput } from 'react-native';

import React, { lazy, Suspense, useState,  useRef } from 'react';
import { CustomSlider } from '@/components/ui/slider';

// const SignInCard = lazy(() => import('"@/components/custom/login/signInCard'));

export default function SignIn() {
  const [sliderValue, setSliderValue] = useState(50);
  return (
      <View style={styles.titleContainer}>
        <Text>Slider Value: {sliderValue}</Text>
        <CustomSlider
          value={sliderValue}
          onValueChange={setSliderValue}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
});
