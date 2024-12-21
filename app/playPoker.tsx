import React, { Suspense, lazy } from "react";
import { View, Text } from "react-native";
import LoadingPage from "@/components/page/loading";
import Poker from "@/components/page/poker";


export default function PlayPoker() {
  return (
    // <View style={{ flex: 1 }}>
      <Suspense fallback={<LoadingPage />}> 
        <Poker />
      </Suspense> 
    // </View>
  );
}