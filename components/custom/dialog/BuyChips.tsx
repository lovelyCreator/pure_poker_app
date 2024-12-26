import React, { useState, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { toast } from "react-toastify"; // Ensure you have a toast library compatible with React Native
import { useAuth } from "@/hooks/useAuth"; // Adjust import paths as needed
import { useNavigation } from "@react-navigation/native";
import { getPokerUrl } from "@/lib/poker";
import useWebSocket from "react-use-websocket";
import { useLogger, useSpan } from "@/utils/logging";
import type { sendPokerAction } from "@/types/poker";
import type { WebSocketMessage } from "@/types/poker";

interface BuyChipsProps {
  gameId: string;
  playerId: string;
  playerBalance: number;
  playerChips: number;
  boughtChips: number;
  amountBet: number;
  bigBlind: number;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const BuyChips: React.FC<BuyChipsProps> = ({
  gameId,
  playerId,
  playerBalance,
  playerChips,
  boughtChips,
  amountBet,
  bigBlind,
  children,
  isOpen,
  setIsOpen,
}) => {
  const navigation = useNavigation();
  const span = useSpan("buyChips");
  const {user} = useAuth();
  const logger = useLogger();

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId, user.username),
    {
      share: true,
      onMessage: (event) => {
        console.log('BuyChip')
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data.action === "buyMoreChips") {
            if (data.statusCode === 200) {
              toast.dismiss();
              toast.success("Successfully bought chips!");
              setIsOpen(false); // Close the popup
            } else {
              toast.dismiss();
              toast.error(data.message || "Failed to buy chips.");
            }
          }
        } catch (e) {
          toast.error("Failed to process the buy-in.");
        }
      },
    }
  );

  const [chipsToBuy, setChipsToBuy] = useState(50);
  const [inputError, setInputError] = useState<string | null>(null);
  const bigBlindDollar = bigBlind / 100;
  const playerChipsDollar = playerChips / 100;
  const boughtChipsDollar = boughtChips / 100;
  const amountBetDollar = amountBet / 100;
  const maxAllowedChips = 250 * bigBlindDollar;
  const maxBuy = maxAllowedChips - (playerChipsDollar + boughtChipsDollar + amountBetDollar);

  useEffect(() => {
    setChipsToBuy(bigBlindDollar);
  }, [bigBlind, playerChips, boughtChips]);

  const handleInputChange = (value: string) => {
    const parsedValue = parseInt(value) || 0;
    setChipsToBuy(parsedValue);

    if (parsedValue < bigBlindDollar) {
      setInputError(`Minimum buy of ${bigBlindDollar} chip.`);
    } else if (parsedValue > maxBuy) {
      if (maxBuy > 0) {
        setInputError(`Cannot exceed ${maxBuy} bought chips.`);
      } else {
        setInputError(`You cannot buy more chips.`);
      }
    } else if (parsedValue > playerBalance) {
      setInputError("Insufficient Player Balance.");
    } else {
      setInputError(null);
    }
  };

  const onBuyChips = (chipsToBuy: number) => {
    const buyMoreChipsMessage: sendPokerAction = {
      action: "sendPokerAction",
      gameId: gameId,
      gameAction: "buyMoreChips",
      buyIn: chipsToBuy * 100,
      raiseAmount: null,
      groups: null,
    };
    sendJsonMessage(buyMoreChipsMessage);
    toast.loading("Processing your buy-in...");
  };

  const handleBuyChips = () => {
    if (chipsToBuy >= bigBlindDollar && chipsToBuy <= maxBuy && chipsToBuy <= playerBalance) {
      onBuyChips(chipsToBuy);
    } else {
      toast.error(`Buy-in must be between ${bigBlindDollar} and ${Math.min(maxBuy, playerBalance)} chips.`);
    }
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
            <Text style={styles.title}>Buy Chips</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>How many chips do you want to buy?</Text>
              <TextInput
                keyboardType="numeric"
                value={String(chipsToBuy)}
                onChangeText={handleInputChange}
                style={styles.input}
                placeholder={`Enter amount (1-${Math.min(maxBuy, playerBalance)})`}
              />
              {inputError && <Text style={styles.error}>{inputError}</Text>}
            </View>
            {boughtChips > 0 && (
              <Text style={styles.info}>
                You have already bought {boughtChipsDollar} chips that will be processed in the next round
              </Text>
            )}
            <View style={styles.balanceContainer}>
              <Image source={require('@/assets/home/icon/coin.png')} style={styles.coinImage} />
              <Text style={styles.balanceText}>Current Balance: {playerBalance}</Text>
            </View>
            <View style={styles.balanceContainer}>
              <Image source={require('@/assets/home/icon/coin.png')} style={styles.coinImage} />
              <Text style={styles.balanceText}>New Balance: {playerBalance - chipsToBuy}</Text>
            </View>
            <Text style={styles.totalChips}>
              New Total Chips: {playerChipsDollar} + {chipsToBuy} = {playerChipsDollar + chipsToBuy}
            </Text>
            <Text style={styles.note}>
              Note: You can buy up to {Math.min(maxBuy, playerBalance)} chips to reach the maximum of {maxAllowedChips} chips (250 big blinds).
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={handleBuyChips}
                disabled={!!inputError}
              >
                <Text style={styles.buttonText}>Buy Chips</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
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
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    color: "#ccc",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#161922",
    color: "#fff",
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  info: {
    color: "#ccc",
    marginBottom: 10,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  coinImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  balanceText: {
    color: "#ccc",
  },
  totalChips: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  note: {
    color: "#ccc",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buyButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
});

export default BuyChips;
