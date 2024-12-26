import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useWebSocket from "react-use-websocket";
import { getPokerUrl, sendPokerMessage } from "@/lib/poker";
import { useAuth } from "@/hooks/useAuth";
import { useSpan } from "@/utils/logging";
import { toast } from "react-toastify";
import { PokerWebSocketMessage } from "@/types/pokerFrontend.";
import { Button } from "@/components/ui/button";

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
  const {user} = useAuth();

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId || undefined, user.username),
    {
      share: true,
      onMessage: (event) => {
        console.log('ShowCardControl')
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
      <Button
        variant="secondary"
        onPress={handleToggleFirstCard}
        style= {[{
          width: 110, paddingVertical: 4, borderColor: '#6B7280', borderRadius: 8, borderWidth: 1
        }, showFirstCard ? 
        {backgroundColor: '#2085F0'} : {backgroundColor: 'transparent'}]}
        textStyle={[{
          fontSize: 12, textAlign: 'center',
        }, showFirstCard ? 
        {color: 'white'} : {color: '#D1D5DB'}]}
      >
        {showFirstCard ? `Showing ${firstCardName}` : `Show ${firstCardName}`}
      </Button>
      <Button
        variant="secondary"
        onPress={handleToggleSecondCard}
        style= {[{
          width: 110, paddingVertical: 4, borderColor: '#6B7280',borderRadius: 8, borderWidth: 1
        }, showSecondCard ? 
        {backgroundColor: '#2085F0'} : {backgroundColor: 'transparent'}]}
        textStyle={[{
          fontSize: 12, textAlign: 'center',
        }, showSecondCard ? 
        {color: 'white'} : {color: '#D1D5DB'}]}
      >
        {showSecondCard ? `Showing ${secondCardName}` : `Show ${secondCardName}`}
      </Button>
      <Button
        variant="secondary"
        onPress={handleToggleBoth}
        style= {[{
          width: 110, paddingVertical: 4, borderColor: '#6B7280', borderRadius: 8, borderWidth: 1 
        }, (showFirstCard && showSecondCard) ? 
        {backgroundColor: '#2085F0'} : {backgroundColor: 'transparent'}]}
        textStyle={[{
          fontSize: 12, textAlign: 'center'
        }, (showFirstCard && showSecondCard) ? 
        {color: 'white'} : {color: '#D1D5DB'}]}
      >
        {(showFirstCard && showSecondCard) ? "Showing Both Cards" : "Show Both Cards"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    padding: 10,
    opacity: 0.75,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'space-between'
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    // elevation: 5,
    
  },
  button: {
    display: 'flex',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#2085F0",
    borderColor: '#FFFFFF'
  },
  inactiveButton: {
    // backgroundColor: "transparent",
    borderColor: '#FFFFFF'
  },
  buttonText: {
    color: "#fff",
  },
});

export default ShowCardControls;
