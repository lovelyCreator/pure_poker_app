import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useWebSocket from "react-use-websocket";
import { getPokerUrl, sendPokerMessage } from "@/lib/poker";
import { useAuth } from "@/hooks/useAuth";
import { useSpan } from "@/utils/logging";
import { toast } from "sonner";
import { PokerWebSocketMessage } from "@/types/pokerFrontend.";

interface ShowCardControlsProps {
  gameId: string;
  firstCardName: string;
  secondCardName: string;
}

const ShowCardControls: React.FC<ShowCardControlsProps> = ({
  gameId,
  firstCardName,
  secondCardName,
}) => {
  const span = useSpan("ShowCardControls");
  const user = useAuth();

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId || undefined, user.username),
    {
      share: true,
      onMessage: (event) => {
        const data: PokerWebSocketMessage = JSON.parse(event.data);

        if (data.action === "showCardsSuccessPersonal") {
          toast.dismiss();
          // toast.success("Successfully updated your card showing preferences.");
        } else if (data.action === "showCardsError") {
          toast.dismiss();
          toast.error("An error occurred with show cards.");
        }
      },
    }
  );

  const [showFirstCard, setShowFirstCard] = useState<boolean>(false);
  const [showSecondCard, setShowSecondCard] = useState<boolean>(false);

  const updateCardPreferences = (firstCardState: boolean, secondCardState: boolean) => {
    const cardBools: [boolean, boolean] = [firstCardState, secondCardState];
    sendPokerMessage(sendJsonMessage, {
      action: "sendPokerAction",
      gameAction: "showCards",
      gameId: gameId,
      raiseAmount: null,
      buyIn: null,
      groups: null,
      cardBools: cardBools,
    });
    // toast.loading("Updating your card preferences.");
  };

  const handleToggleFirstCard = () => {
    const newFirstCardState = !showFirstCard;
    setShowFirstCard(newFirstCardState);
    updateCardPreferences(newFirstCardState, showSecondCard);
  };

  const handleToggleSecondCard = () => {
    const newSecondCardState = !showSecondCard;
    setShowSecondCard(newSecondCardState);
    updateCardPreferences(showFirstCard, newSecondCardState);
  };

  const handleToggleBoth = () => {
    const newState = !(showFirstCard && showSecondCard);
    setShowFirstCard(newState);
    setShowSecondCard(newState);
    updateCardPreferences(newState, newState);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          showFirstCard ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={handleToggleFirstCard}
      >
        <Text style={styles.buttonText}>
          {showFirstCard ? `Showing ${firstCardName}` : `Show ${firstCardName}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          showSecondCard ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={handleToggleSecondCard}
      >
        <Text style={styles.buttonText}>
          {showSecondCard ? `Showing ${secondCardName}` : `Show ${secondCardName}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          (showFirstCard && showSecondCard) ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={handleToggleBoth}
      >
        <Text style={styles.buttonText}>
          {showFirstCard && showSecondCard ? "Showing Both Cards" : "Show Both Cards"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#2085F0",
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ShowCardControls;
