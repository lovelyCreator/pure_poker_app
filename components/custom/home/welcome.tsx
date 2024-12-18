import React, { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import CreateOrJoinGame from "../dialog/CreateOrJoinGame";
import { Button } from "@/components/ui/button";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default function Welcome() {
  // const user = useAuth();
  const user = {username: 'Pang', clearApproval: 'approved'}
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/home/home-welcome-bg.png')}
        style={styles.background}
        imageStyle={styles.image}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Welcome back, {user.username} 🎉
          </Text>
          <Text style={styles.description}>
            Please visit purepoker.world for a of a complete experience
          </Text>
          <View style={styles.buttonContainer}>
            {user.clearApproval === 'approved' ?
            <Button variant="home" style={styles.button} textStyle={styles.buttonText}>
              Create New Game
            </Button>
            : 
            <></>  
          }
            {/* <CreateOrJoinGame
              userIsVerified={user.clearApproval === "approved"}
              isCreateGame={true}
            >
              <Button variant="home" className="button">
                Create New Game
              </Button>
            </CreateOrJoinGame> */}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
  },
  background: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    height: '100%'
  },
  image: {
    borderRadius: 18,
    resizeMode: 'stretch',
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
    color: 'white',
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: '#FFFFFF', // Example color
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    color: '#1E84F0',
  },
  buttonText: {
    color: '#1E84F0',
    fontSize: 16,
  },
  home: {
    // Add specific styles for the home variant if needed
  },
});
