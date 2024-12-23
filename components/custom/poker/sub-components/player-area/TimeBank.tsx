import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useWebSocket from "react-use-websocket";
import { Player, sendPokerAction, WebSocketMessage } from "@/types/poker";
import { getPokerUrl } from "@/lib/poker";
import { useSpan } from "@/utils/logging";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

type TimeBankProps = {
  player: Player;
  gameId: string;
};

const TimeBank: React.FC<TimeBankProps> = ({ player, gameId }) => {
  const timeBanksRemaining = player.timeBanksRemaining;
  const user = useAuth();
  const span = useSpan("addTime");
  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId, user.username),
    {
      share: true,
      onMessage: (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data.action === "addTime") {
            if (data.statusCode !== 200) {
              toast.dismiss();
              toast.error("Failed to add time bank.");
            } 
          }
        } catch (e) {
          toast.error("Failed to add time bank.");
        }
      },
    }
  );

  const handleUseTimeBank = () => {
    const addTimeMessage: sendPokerAction = {
      action: "sendPokerAction",
      gameId: gameId,
      gameAction: "addTime",
      buyIn: null,
      raiseAmount: null,
      groups: null,
      additionalSeconds: 30,
    };
    sendJsonMessage(addTimeMessage);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        timeBanksRemaining === 0 ? styles.disabledButton : styles.enabledButton,
      ]}
      onPress={handleUseTimeBank}
      disabled={timeBanksRemaining === 0}
    >
      <Text style={styles.buttonText}>+30</Text>
      <View style={styles.timeBankContainer}>
        <Text style={styles.timeBankText}>{timeBanksRemaining}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 5,
    width: "16%",
    height: "32%",
    borderRadius: 10,
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 50
  },
  enabledButton: {
    backgroundColor: "rgba(220, 38, 38, 0.8)", // Equivalent to bg-red-700/80
  },
  disabledButton: {
    backgroundColor: "rgba(220, 38, 38, 0.5)", // Equivalent to opacity-50
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  timeBankContainer: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "gray",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timeBankText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default TimeBank;
