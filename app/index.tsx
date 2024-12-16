import { StyleSheet, Image, Platform, ScrollView, Text, View, TextInput } from 'react-native';

import React, { lazy, Suspense, useState,  useRef } from 'react';
import SignInScreen from '@/components/custom/login/signInCard';

// const SignInCard = lazy(() => import('"@/components/custom/login/signInCard'));

export default function SignIn() {
  return (
      <View style={styles.titleContainer}>
        <SignInScreen />
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
