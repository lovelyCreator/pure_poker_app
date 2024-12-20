import React, { useState } from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import BuyChips from "../../dialog/BuyChips";

interface BuyChipsPopupProps {
  gameId: string;
  playerId: string;
  playerBalance: number;
  playerChips: number;
  boughtChips: number;
  amountBet: number;
  bigBlind: number;
}

const BuyChipsPopup: React.FC<BuyChipsPopupProps> = ({
  gameId,
  playerId,
  playerBalance,
  playerChips,
  boughtChips,
  amountBet,
  bigBlind,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <BuyChips
        gameId={gameId}
        playerId={playerId}
        playerBalance={playerBalance}
        playerChips={playerChips}
        boughtChips={boughtChips}
        amountBet={amountBet}
        bigBlind={bigBlind}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          <Text style={styles.icon}>➕</Text> Top-up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#161922',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    transitionDuration: '200ms',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
  icon: {
    marginRight: 8,
    fontSize: 20,
  },
});

export default BuyChipsPopup;
