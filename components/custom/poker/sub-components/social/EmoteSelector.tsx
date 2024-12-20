import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import useWebSocket from "react-native-use-websocket";
import { sendPokerAction, WebSocketMessage } from "@/types/poker"; // Adjust the import according to your project structure
import { getPokerUrl } from "@/lib/poker"; // Adjust the import according to your project structure
import { useSpan } from "@/utils/logging"; // Adjust the import according to your project structure
import { useAuth } from "@/hooks/useAuth"; // Adjust the import according to your project structure
import { toast } from "sonner"; // Ensure you have a toast library installed

interface EmoteSelectorProps {
  gameId: string;
}

const emotes = ["🤣", "😡", "😩", "🤡", "😁", "🤑", "🥲", "😘", "🤗", "🐥"];
const texts: string[] = []; // Placeholder for additional texts

const EmoteSelector: React.FC<EmoteSelectorProps> = ({ gameId }) => {
  const user = useAuth();
  const span = useSpan("sendEmote");
  const { sendJsonMessage, lastMessage } = useWebSocket(getPokerUrl(span, gameId, user.username), {
    share: true,
    onMessage: (event: any) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.action === "sendEmote" && data.statusCode !== 200) {
          toast.dismiss();
          toast.error("Failed to send emote.");
        }
      } catch {
        toast.error("Failed to send emote.");
      }
    },
  });

  const handleSendEmote = (emote: string) => {
    if (emote) {
      const emoteMessage: sendPokerAction = {
        action: "sendPokerAction",
        gameId: gameId,
        gameAction: "sendEmote",
        buyIn: null,
        raiseAmount: null,
        groups: null,
        message: null,
        emote: emote,
      };
      sendJsonMessage(emoteMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {(emotes.concat(texts)).map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleSendEmote(item)}
            style={[
              styles.button,
              item.length === 2 ? styles.emoteButton : styles.textButton,
            ]}
          >
            <Text style={item.length === 2 ? styles.emoteText : styles.text}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: -125,
    top: -70,
    width: 120,
    height: 100,
    backgroundColor: "#1c202b",
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#5f5f5f",
    zIndex: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 5,
    margin: 5,
    padding: 5,
    borderWidth: 2,
    borderColor: "transparent",
    transitionDuration: "300ms",
  },
  emoteButton: {
    width: "45%",
    backgroundColor: "#2c2f36",
    alignItems: "center",
  },
  textButton: {
    width: "45%",
    backgroundColor: "#2c2f36",
    alignItems: "center",
  },
  emoteText: {
    fontSize: 24,
    color: "white",
  },
  text: {
    fontSize: 14,
    color: "white",
  },
});

export default EmoteSelector;
