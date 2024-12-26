import React, { useState } from "react";
import { View, Text, Button, Modal, TextInput, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { motion } from "framer-motion"; // Note: framer-motion is not available in React Native, consider removing it
import useWebSocket from "react-use-websocket";
import { getPokerUrl } from "@/lib/poker";
import { useSpan } from "@/utils/logging";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify"; // Consider using a compatible toast library for React Native
import { sendPokerAction, Player, GameState, WebSocketMessage } from "@/types/poker";
import { Image } from 'react-native'; // Use Image from React Native
import { MotiView } from "moti";

type CreateBombPotProps = {
  thisPlayer: Player;
  gameState: GameState;
  gameId: string;
};

const CreateBombPot: React.FC<CreateBombPotProps> = ({ thisPlayer, gameId, gameState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfBigBlinds, setNumberOfBigBlinds] = useState(5); // Default value
  const [postFlopBetting, setPostFlopBetting] = useState(true);

  const {user} = useAuth();
  const span = useSpan("createBombPot");
  const { sendJsonMessage } = useWebSocket(getPokerUrl(span, gameId, user.username), {
    share: true,
    onMessage: (event) => {
      console.log('CreateBomb')
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.action === "createBombPot" && data.statusCode !== 200) {
          toast.error("Failed to propose Bomb Pot.");
        }
      } catch (e) {
        toast.error("Failed to process Bomb Pot proposal.");
      }
    },
  });
  console.log('Create Bomb:', thisPlayer, "GameStates", gameState, "GameIds",gameId)
  const isBombPotProposed = gameState.isBombPotProposed ?? false;
  // const isInitiator = gameState.bombPotSettings?.initiatorUsername === thisPlayer.username;

  const handleProposeBombPot = () => {
    const bombPotMessage: sendPokerAction = {
      action: "sendPokerAction",
      gameId,
      gameAction: "createBombPot",
      bombPotSettings: {
        numberOfBigBlinds,
        postFlopBetting,
        // initiatorUsername: thisPlayer.username,
      },
    };
    sendJsonMessage(bombPotMessage);
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    if (!isBombPotProposed) {
      setIsModalOpen((prev) => !prev);
    }
  };

  if (isBombPotProposed && !isInitiator) {
    return null; // Don't render the button if a bomb pot is proposed by someone else
  }

  return (
    <>
      {/* Bomb Icon Button */}
      <MotiView
        from={isBombPotProposed && isInitiator ? { scale: 1} : undefined}
        animate={
          isBombPotProposed && isInitiator
          ? { scale: [1, 1.1, 0.9, 1], rotate: [0, 5, -5, 0]}
          : undefined
        }
        style={{
          pointerEvents: isBombPotProposed && isInitiator ? 'none' : 'auto'
        }}
      >
        <TouchableOpacity
          onPress={toggleModal}
          style={[
            styles.bombButton,
            isBombPotProposed && isInitiator && styles.activeBombButton,
          ]}
        >
          <Image
            source={require('@/assets/game/bomb-pot-icon.png')} // Adjust path as necessary
            style={styles.bombIcon}
          />
        </TouchableOpacity>
      </MotiView>

      {/* Modal */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}># Of Big Blinds</Text>
              <TextInput
                keyboardType="numeric"
                value={numberOfBigBlinds.toString()}
                onChangeText={(value) => setNumberOfBigBlinds(Number(value))}
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Allow Post-Flop Bets?</Text>
              <Switch
                value={postFlopBetting}
                onValueChange={() => setPostFlopBetting(!postFlopBetting)}
              />
            </View>
            <Button
              title="Propose Bomb Pot"
              onPress={handleProposeBombPot}
              color="#007BFF"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bombButton: {
    position: 'absolute',
    left: -150,
    bottom: -180,
    padding: 10,
    borderRadius: 50,
  },
  activeBombButton: {
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
  },
  bombIcon: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    color: '#BBBCBF',
    marginBottom: 5,
  },
  input: {
    width: 60,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#444',
    color: 'white',
  },
});

export default CreateBombPot;
