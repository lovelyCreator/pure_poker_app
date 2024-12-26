import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { useSearchParams } from 'expo-router/build/hooks';
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import SitOut from "../../../dialog/SitOut"; // Ensure this is compatible with React Native

type SitOutPopUpProps = {
  isSittingOutNextHand: boolean;
  setIsSittingOutNextHand: (value: boolean) => void;
};

const SitOutPopUp: React.FC<SitOutPopUpProps> = ({
  isSittingOutNextHand,
  setIsSittingOutNextHand,
}) => {
  const auth = useAuth().user;
  const {gameId} = useRoute().params;

  return (
    <View style={styles.container}>
      <SitOut
        gameId={gameId ?? ""}
        playerId={auth.username}
        isSittingOutNextHand={isSittingOutNextHand}
        setIsSittingOutNextHand={setIsSittingOutNextHand}
      >
        <View style={[styles.buttonContainer, isSittingOutNextHand ? styles.activeButton : styles.inactiveButton]}>
          <Text style={styles.buttonText}>
            {isSittingOutNextHand ? "Come Back" : "Sit Out"}
          </Text>
        </View>
      </SitOut>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#161922',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    transitionDuration: '200ms',
  },
  activeButton: {
    borderColor: 'green',
    backgroundColor: '#1f2e1e',
  },
  inactiveButton: {
    borderColor: 'yellow',
    backgroundColor: '#1c1f2e',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18, // Adjust based on your design
  },
});

export default SitOutPopUp;
