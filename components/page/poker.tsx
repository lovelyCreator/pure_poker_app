import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';
import useWebSocket from 'react-use-websocket';
import { fetchGameState, getPokerUrl, playSound } from '@/lib/poker'; // Adjust the import path as necessary


const PokerGame = () => {
  const [gameId, setGameId] = useState(''); // Set your gameId here
  const [gameState, setGameState] = useState(null);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [user, setUser] = useState({ username: 'Player1', chips: 1000 }); // Mock user data
  const [lastSynced, setLastSynced] = useState(Date.now());
  const [playSoundEnabled, setPlaySoundEnabled] = useState(true);

  const { sendJsonMessage } = useWebSocket(getPokerUrl(gameId, user.username), {
    onOpen: () => {
      sendJsonMessage({ action: 'authenticate', token: 'YOUR_TOKEN_HERE' });
    },
    onMessage: (event) => {
      const res = JSON.parse(event.data);
      if (res.action === 'joinGamePlayer') {
        setShowJoinPopup(false);
        Alert.alert('Success', 'Successfully joined the game!');
      } else if (res.action === 'badRequest') {
        Alert.alert('Error', res.message);
      } else {
        setGameState(res.gameDetails);
        setLastSynced(Date.now());
      }
    },
  });

  useEffect(() => {
    if (!gameState) {
      setShowJoinPopup(true);
    }
  }, [gameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if ((now - lastSynced) / 1000 > 3) {
        fetchGameState(gameId).then(setGameState).catch(console.error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [lastSynced, gameId]);

  const handleJoinGame = () => {
    sendJsonMessage({ action: 'joinGame', gameId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Poker Game</Text>
      {gameState ? (
        <View>
          <Text>Game State: {JSON.stringify(gameState)}</Text>
          <Text>Player: {user.username}</Text>
          <Text>Chips: {user.chips}</Text>
        </View>
      ) : (
        <Text>Loading game...</Text>
      )}
      <Button title="Join Game" onPress={handleJoinGame} />

      <Modal visible={showJoinPopup} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Join Game</Text>
            <Button title="Confirm" onPress={handleJoinGame} />
            <Button title="Cancel" onPress={() => setShowJoinPopup(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default PokerGame;
