import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import CreateOrJoinGame from "../dialog/CreateOrJoinGame";
import { enableFreeze } from "react-native-screens";

interface JoinPopupProps {
  userIsVerified: boolean;
  gameId?: string;
  setShowJoinPopup: (value: boolean) => void;
  setIsSpectator: (value: boolean) => void;
}

const JoinPopup: React.FC<JoinPopupProps> = ({
  userIsVerified,
  gameId = "",
  setShowJoinPopup,
  setIsSpectator,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={true} // You might want to control this with a state in your parent component
      onRequestClose={() => setShowJoinPopup(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.text}>
            You haven't joined this game yet. Would you like to play or spectate?
          </Text>
          <View style={styles.buttonContainer}>
            <CreateOrJoinGame
              userIsVerified={userIsVerified}
              isCreateGame={false}
              defaultGameId={gameId}
            >
              <View
                style={[{
                  backgroundColor: '#3B82F6',
                  padding: 11,
                  borderRadius: 8
                }, 
                  userIsVerified ? styles.enabledView : styles.disabledButton,
                ]}
              >
                <Text style={{color:'white'}}>
                Join Game
                </Text>
              </View>
            </CreateOrJoinGame>
            <Button
              textStyle={{color: 'white'}}
              style={{
                marginLeft: 16,
                backgroundColor: '#6B7280'
              }}
              onPress={() => {
                console.log('joinPopup')
                setShowJoinPopup(false);
                setIsSpectator(true);
              }}
            >
              Spectate
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with opacity
  },
  container: {
    position: 'relative',
    zIndex: 60,
    marginHorizontal: 'auto',
    maxWidth: 300,
    backgroundColor: "#212530", // Background color
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    marginBottom: 24,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  enabledButton: {
      backgroundColor: "#3B82F6", // Blue color for verified
      cursor: 'pointer',
  },
  disabledButton: {
      backgroundColor: "#6c757d", // Gray color for not verified
      opacity: 0.5, // Dim the button to indicate it's not clickable
  },
});

export default JoinPopup;
