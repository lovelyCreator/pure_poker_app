import { StyleSheet, Image, View } from 'react-native';

import React, { lazy, Suspense, useState,  useRef } from 'react';
import SignInScreen from '@/components/custom/login/signInCard';
import { SpanWrapper } from '@/utils/logging';

// const SignInCard = lazy(() => import('"@/components/custom/login/signInCard'));

export default function SignIn() {
  return (
    <SpanWrapper name="SignInScreen">
      <View style={{backgroundColor: '#11141D', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image style={[styles.mark]} source={require('@/assets/global/pure-poker-logo.png')} />
        <View style={styles.main}>
          <SignInScreen />
        </View>
        <Image style={[styles.rightmark]} source={require('@/assets/groups/Group.png')} />
        <Image style={[styles.leftmark]} source={require('@/assets/groups/Group 1.png')} />
      </View>
    </SpanWrapper>
  );
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    height: 'auto',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 30,
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 1,
  },
  leftmark: {
    position: 'absolute',
    left: 0,
    top: '60%'
  },
  rightmark: {
    position: 'absolute',
    right: 0,
    top: '20%'
  }
});
