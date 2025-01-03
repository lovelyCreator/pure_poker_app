import React, { useEffect } from "react";
import SignInCard from "../components/custom/login/signInCard";
import { View, StyleSheet } from "react-native";
import { SpanWrapper } from "@/utils/logging";
import { ToastContainer } from "react-toastify";

export default function NotLoggedIn() {
  console.log('Not LogIned ')

  return (
    <SpanWrapper name="NotLoggedInScreen">
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
  container: { 
    height: '100%', 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11141D',
    width: '100%',
  },
})
