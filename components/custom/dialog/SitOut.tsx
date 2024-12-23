import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import useWebSocket from "react-use-websocket";
import { toast } from "react-toastify"; // Ensure you have a toast library compatible with React Native
import { useAuth } from "@/hooks/useAuth"; // Adjust import paths as needed
import { getPokerUrl } from "@/lib/poker";
import type { sendPokerAction } from "@/types/poker";
import type { WebSocketMessage } from "@/types/poker";
import { useSpan } from "@/utils/logging";
import { useNavigation } from "@react-navigation/native";

interface SitOutProps {
  children: React.ReactNode;
  gameId: string;
  playerId: string;
  isSittingOutNextHand: boolean;
  setIsSittingOutNextHand: (value: boolean) => void;
}

const SitOut: React.FC<SitOutProps> = ({
  children,
  gameId,
  playerId,
  isSittingOutNextHand,
  setIsSittingOutNextHand,
}) => {
  const span = useSpan("sitOut");
  const user = useAuth();
  const navigation = useNavigation ();
  const [isOpen, setIsOpen] = useState(false);

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId, user.username),
    {
      share: true,
      onMessage: (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data.action === "sitOutNextHand") {
            if (data.statusCode === 200) {
              toast.dismiss();
              setIsOpen(false);
              setIsSittingOutNextHand(!isSittingOutNextHand);
              console.log(isSittingOutNextHand, "isSittingoutNextHand")
              return;
            }
            if (data.statusCode === 404) {
              toast.dismiss();
              toast.error(data.message);
              return;
            } else {
              toast.dismiss();
              toast.error(data.message);
            }
          } else if (data.action === "playerReady") {
            toast.dismiss();
            setIsOpen(false);
            return;
          }
        } catch (e) {
          toast.error("Failed to sit out the next hand.");
        }
      },
    }
  );

  const confirmSitOutNextHand = () => {
    const sitOutNextHandMessage: sendPokerAction = {
      action: "sendPokerAction",
      gameId: gameId,
      gameAction: "sitOutNextHand",
      buyIn: null,
      raiseAmount: null,
      groups: null,
    };
    sendJsonMessage(sitOutNextHandMessage);
    toast.loading(
      isSittingOutNextHand
        ? "Coming back the next hand..."
        : "Sitting out the next hand..."
    );
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
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
            <Text style={styles.title}>
              {isSittingOutNextHand
                ? "Are you sure you want to join back in the next hand?"
                : "Are you sure you want to sit out the next hand?"}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={confirmSitOutNextHand}>
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

export default SitOut;
