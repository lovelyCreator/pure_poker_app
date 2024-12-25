// 

import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { MessageSquareMore, CircleX, Send } from "lucide-react-native"; // Ensure you have lucide-react-native installed
import { MotiView, AnimatePresence } from "moti";
import { GameState, sendPokerAction, WebSocketMessage } from "@/types/poker";
import useWebSocket from "react-use-websocket";
import { getPokerUrl, ScreenSize } from "@/lib/poker";
import { useSpan } from "@/utils/logging";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PokerChatProps {
  gameState: GameState;
  screenSize: ScreenSize;
}

const PokerChat: React.FC<PokerChatProps> = ({ gameState, screenSize }) => {
  const user = useAuth();
  const span = useSpan("sendPokerChatMessage");
  const [messages, setMessages] = useState(gameState?.chatMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 350, height: 350 });
  const [seenMessagesCount, setSeenMessagesCount] = useState(messages.length);
  const chatEndRef = useRef<View | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(messages.length - seenMessagesCount);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameState.gameId, user.username),
    {
      share: true,
      onMessage: (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data.action === "sendPokerChatMessage") {
            if (data.statusCode !== 200) {
              toast.dismiss();
              toast.error("Failed to send message.");
            }
          }
        } catch (e) {
          toast.error("Failed to send message.");
        }
      },
    }
  );

  useEffect(() => {
    setMessages(gameState?.chatMessages);
    setUnreadMessages(gameState?.chatMessages.length - seenMessagesCount);
  }, [gameState?.chatMessages]);

  useEffect(() => {
    if (isAtBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const pokerChatMessage: sendPokerAction = {
        action: "sendPokerAction",
        gameId: gameState.gameId,
        gameAction: "sendPokerChatMessage",
        buyIn: null,
        raiseAmount: null,
        groups: null,
        message: newMessage
      };
      const dynamicMessage = {
        username: user.username,
        message: newMessage,
        time: new Date().toISOString()
      };
      sendJsonMessage(pokerChatMessage);
      setMessages((prevMessages) => [...prevMessages, dynamicMessage]);
      setNewMessage("");
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isUserAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // Small tolerance
        setIsAtBottom(isUserAtBottom);
    }
};


  const handleOpenChat = () => {
    setChatIsOpen(true);
    setUnreadMessages(0);
    setSeenMessagesCount(gameState?.chatMessages.length);
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleCloseChat = () => {
    setChatIsOpen(false);
    setUnreadMessages(0);
    setSeenMessagesCount(gameState?.chatMessages.length);
  };

  const handleInputChange = (input: string) => {
    if (input.length <= 100) {
      setNewMessage(input);
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = chatSize.width;
      const startHeight = chatSize.height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
          const newWidth = Math.min(
          Math.max(300, startWidth + (moveEvent.clientX - startX)),
          700
          );
          const newHeight = Math.min(
          Math.max(200, startHeight - (moveEvent.clientY - startY)),
          700
          );

          setChatSize({ width: newWidth, height: newHeight });
      };

      const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
  };


  return (
    <>
      <AnimatePresence>
        {chatIsOpen ? (
          <MotiView
            key="chat"
            from={{ opacity: 0, translateX: -200 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: 200 }}
            transition={{ duration: 200 }}
            style={styles.chatContainer}
          >
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseChat}>
              <CircleX size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Game Chat</Text>
            <ScrollView
              style={styles.messagesContainer}
              onScroll={handleScroll}
              ref={chatEndRef}
              scrollEventThrottle={16}
            >
              {messages.map((msg, index) => (
                <View key={index} style={[styles.message, msg.username === user.username ? styles.myMessage : styles.otherMessage]}>
                  <Text style={styles.messageHeader}>
                    <Text style={msg.username === user.username ? styles.myUsername : styles.otherUsername}>
                      {msg.username}
                    </Text>{" "}
                    <Text style={styles.messageTime}>
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                </View>
              ))}
              <View ref={chatEndRef} />
            </ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#ccc"
                value={newMessage}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Send size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.charCount}>{newMessage.length}/100</Text>
            </View>
          </MotiView>
        ) : (
          <MotiView
            key="icon"
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 200 }}
            style={styles.iconContainer}
          >
            <TouchableOpacity 
              onPress={handleOpenChat}>
                <MessageSquareMore size={20} color="white" />
                {!chatIsOpen && unreadMessages > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadMessages}</Text>
                </View>
                )}
            </TouchableOpacity>
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    width: 300,
    height: 350,
    backgroundColor: '#1c202b99',
    padding: 10,
    borderWidth: 2,
    borderColor: '#5f5f5f',
    borderRadius: 10,
    zIndex: 50,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'goldenrod',
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#5f5f5f',
  },
  myMessage: {
    backgroundColor: '#1e84f099',
  },
  otherMessage: {
    backgroundColor: '#2c2f3699',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  myUsername: {
    fontWeight: 'bold',
    color: '#fff700',
  },
  otherUsername: {
    fontWeight: 'bold',
    color: 'white',
  },
  messageTime: {
    fontSize: 10,
    marginLeft: 5,
    color: 'gray',
  },
  messageText: {
    fontSize: 14,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2c2f36',
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5f5f5f',
    marginRight: 5,
  },
  sendButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  charCount: {
    color: 'gray',
    marginLeft: 5,
  },
  iconContainer: {
    padding: 10,
    backgroundColor: '#1B1F28',
    borderRadius: 50,
    width: 40,
    height: 40,
    zIndex: 100
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PokerChat;
