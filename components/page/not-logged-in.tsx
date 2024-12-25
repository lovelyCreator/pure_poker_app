"use client";
import React, { useEffect } from "react";
import SignInCard from "../custom/login/signInCard";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";

export default function NotLoggedIn() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.navigate('index')
  }, []);

  return (
    <View style={styles.container}>
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
