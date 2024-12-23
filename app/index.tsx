import { StyleSheet, Image, View } from 'react-native';

import React, { lazy, Suspense, useState,  useRef } from 'react';
import SignInCard from '@/components/custom/login/signInCard';
import { SpanWrapper } from '@/utils/logging';
import { ToastContainer } from 'react-toastify';

// const SignInCard = lazy(() => import('"@/components/custom/login/signInCard'));

export default function SignIn() {
  return (
    <SpanWrapper name="SignInScreen">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <View style={{backgroundColor: '#11141D', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SignInCard />
      </View>
    </SpanWrapper>
  );
}

const styles = StyleSheet.create({
});
