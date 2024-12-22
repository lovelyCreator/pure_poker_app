import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from "react-native";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner"; // Ensure you have a toast library compatible with React Native
import { useAuth } from "@/hooks/useAuth"; // Adjust import paths as needed
import { getPokerUrl } from "@/lib/poker";
import type { sendPokerAction } from "@/types/poker";
import type { PokerActionsFrontend } from "@/types/pokerFrontend.";
import assert from "assert";
import { useSpan } from "@/utils/logging";
import { useNavigation } from "expo-router";

interface LeaveGameProps {
  children: React.ReactNode;
  gameId: any;
  playerId: string;
}

const LeaveGame: React.FC<LeaveGameProps> = ({ children, gameId, playerId }) => {
  const user = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const span = useSpan("LeaveGame");
  const navigation = useNavigation();
  const s_sapn = span.span("webSocket");

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId, user.username),
    {
      share: true,
      onMessage: (eventString) => {
        try {
          // assert(typeof eventString.data === "string", "Event is not a string");
          const res = JSON.parse(eventString.data) as PokerActionsFrontend;
          console.log("LEAVE GAME", res.action)
          if (res.action === "leaveGamePlayer") {
            toast.dismiss();
            toast.success("Successfully left the game!");
            setIsOpen(false); // Close the dialog on successful leave
          }
        } catch (e) {
          console.log(e);
        }
      },
    }
  );

  const confirmLeaveGame = () => {
    span.info(
      "User confirmed they want to leave the game. Attempting to exit.",
    );
    const leaveGameMessage: sendPokerAction = {
      action: "sendPokerAction",
      gameId: gameId,
      gameAction: "leaveGame",
      buyIn: null,
      raiseAmount: null,
      groups: null,
    };

    sendJsonMessage(leaveGameMessage);
    toast.loading("Leaving game...");
  };

  return (
    <>
      <TouchableOpacity onPress={() => {setIsOpen(true), console.log('isOpen', isOpen);
      }}>
        {children}
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Are you sure you want to leave the game?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={confirmLeaveGame}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setIsOpen(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#212530",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LeaveGame;
