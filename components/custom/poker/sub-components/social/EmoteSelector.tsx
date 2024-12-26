import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import useWebSocket from "react-native-use-websocket";
import { sendPokerAction, WebSocketMessage } from "@/types/poker"; // Adjust the import according to your project structure
import { getPokerUrl } from "@/lib/poker"; // Adjust the import according to your project structure
import { useSpan } from "@/utils/logging"; // Adjust the import according to your project structure
import { useAuth } from "@/hooks/useAuth"; // Adjust the import according to your project structure
import { toast } from "react-toastify"; // Ensure you have a toast library installed
import { AnimatePresence, MotiView } from "moti";

interface EmoteSelectorProps {
  gameId: string;
}

const emotes = ["🤣", "😡", "😩", "🤡", "😁", "🤑", "🥲", "😘", "🤗", "🐥"];
const texts: string[] = []; // Placeholder for additional texts

const EmoteSelector: React.FC<EmoteSelectorProps> = ({ gameId }) => {
  const {user} = useAuth();
  const span = useSpan("sendEmote");
  const { sendJsonMessage } = useWebSocket(getPokerUrl(span, gameId, user.username), {
    share: true,
    onMessage: (event: any) => {
      try {
        console.log('EmoteMessage')
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
    <AnimatePresence>
      <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type:'timing', duration: 0.3 }}
          style={[ styles.container, {
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
          }]}
        >
        <ScrollView contentContainerStyle={styles.scrollView}>
        {[...emotes, ...texts].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleSendEmote(item)}
            style={[
              styles.button,
              item.length === 2 ? styles.largeButton : styles.smallButton,
              item.length > 2 && styles.dynamicWidth,
            ]}
          >
            <Text style={item.length === 2 ? styles.largeText : styles.smallText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </MotiView>
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 100,
    top: -70,
    width: 120,
    height: 100,
    backgroundColor: "#1c202b",
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#5f5f5f",
    zIndex: 150,
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
    margin: 1,
    borderWidth: 2,
    borderColor: "transparent",
    transitionDuration: "300ms",
  },
  largeButton: {
    padding: 2
  },
  smallButton: {
    backgroundColor: '#2c2f36',
    paddingVertical: 8, // Equivalent to py-1
    paddingHorizontal: 12, // Equivalent to px-3
  },
  dynamicWidth: {
    minWidth: '45%',
    maxWidth: '45%',
  },
  largeText: {
    fontSize: 24, // Equivalent to text-2xl
    // Responsive styles can be added based on screen size
  },
  smallText: {
    fontSize: 14, // Equivalent to text-sm
    color: '#ffffff', // Equivalent to text-white
  },
});

export default EmoteSelector;
