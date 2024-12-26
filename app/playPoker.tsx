import React, { Suspense, lazy } from "react";
import { View, Text } from "react-native";
import LoadingPage from "@/components/page/loading";
import Poker from "@/components/page/poker";
import {ToastContainer} from 'react-toastify'


export default function PlayPoker( ) {
  return (
    // <View style={{ flex: 1 }}>
      <Suspense fallback={<LoadingPage />}> 
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
        <Poker />
      </Suspense> 
    // </View>
  );
}