import React, { useEffect } from "react";
import SignInCard from "../components/custom/login/signInCard";
import { View, StyleSheet } from "react-native";
import { SpanWrapper } from "@/utils/logging";
import { ToastContainer } from "react-toastify";
import { useNavigation } from '@react-navigation/native';

export default function NotLoggedIn() {
  const navigation = useNavigation();
  console.log('Not LogIned ')
  useEffect(() => {
    navigation.navigate('index');
  })

  return (
      <View style={{backgroundColor: '#11141D', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SignInCard />
      </View>
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
