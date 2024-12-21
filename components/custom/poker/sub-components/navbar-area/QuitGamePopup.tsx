import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native"; // Use React Navigation for route parameters
import { useAuth } from "@/hooks/useAuth";
import LeaveGame from "../../../dialog/LeaveGame"; // Ensure this is compatible with React Native
import { Image } from 'react-native'; // Use Image from React Native

const QuitGamePopup: React.FC = () => {
  const auth = useAuth();
  const route = useRoute(); // Get the route object
  const gameId = route.params?.gameId; // Access gameId from route parameters

  return (
    // <View style={styles.container}>
      <LeaveGame gameId={gameId ?? ""} playerId={auth.username}>
        <View style={styles.button}>
          <Image source={require('@/assets/game/quit.png')} style={styles.icon} resizeMode="contain" />
        </View>
      </LeaveGame>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 48, // Adjust height as needed
    width: 48,  // Adjust width as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});

export default QuitGamePopup;
