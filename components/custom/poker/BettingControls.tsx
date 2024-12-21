/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React, { useEffect, useState } from "react";
import type { Player, GameState } from "@/types/poker";
import Check from "../button/check";
import Call from "../button/call";
import Raise from "../button/raise";
import Fold from "../button/fold";
import useWebSocket from "react-use-websocket";
import { getEasyBettingOptions, getPokerUrl, ScreenSize } from "@/lib/poker";
import { sendPokerMessage } from "@/lib/poker";
import { Button } from "@/components/ui/button";
import TooltipSlider from "@/components/ui/sliderRc";
import { useSpan } from "@/utils/logging";
import type { User } from "@/types/user";
import ShowCardControls from "./sub-components/player-area/ShowCardControls";
import TimeBank from "./sub-components/player-area/TimeBank";
import { StyleSheet, TextInput, View, Text } from "react-native";

interface BettingControlsProps {
  gameId: string;
  gameState: GameState;
  currentPlayer: Player;
  currentPlayerId: string;
  playerId: string;
  user: User;
  setInactivityCount: (count: number) => void;
  actionButtonsDisabled: boolean;
  setActionButtonsDisabled: (value: boolean) => void;
  raiseAmount: number;
  setRaiseAmount: (count: number) => void;
  foldToAny: boolean;
  setFoldToAny: (value: boolean) => void;
  screenSize: ScreenSize;
  displayBB: boolean;
  initialBigBlind: number;
}

const BettingControls: React.FC<BettingControlsProps> = ({
  gameId,
  gameState,
  currentPlayer,
  currentPlayerId,
  playerId,
  user,
  setInactivityCount,
  actionButtonsDisabled,
  setActionButtonsDisabled,
  raiseAmount,
  setRaiseAmount,
  foldToAny,
  setFoldToAny,
  screenSize,
  displayBB,
  initialBigBlind,
}) => {
  const span = useSpan("GameplayPokerMain");
  const isPlayerTurn = currentPlayerId === playerId;
  const thisPlayer = gameState?.players.find(
    (player) => player.id === playerId,
  );
  const canCheck = thisPlayer && thisPlayer.bet >= gameState.highestBet;
  const showPotPercentage =
    gameState.pot > 6 * gameState.initialBigBlind &&
    gameState.minRaiseAmount > 6 * gameState.initialBigBlind;
  let foldToAnyCopy = foldToAny;

  const hasFolded = !thisPlayer?.inHand;
  const [firstCardName = "Card 1", secondCardName = "Card 2"] = thisPlayer?.hand
    ? thisPlayer.hand.map((card: string) => card.replace("T", "10"))
    : [];

  const hasCards = thisPlayer?.hand && thisPlayer.hand.length > 0;
  const gameIsOver = !gameState.gameInProgress;
  const [inputValue, setInputValue] = useState<string>(
    ((raiseAmount ?? 0) / 100).toString(),
  );
  const mustShowCards = gameIsOver && !hasFolded && thisPlayer.handDescription;

  // Define betting options
  const easyBettingOptions = getEasyBettingOptions(gameState, currentPlayer);

  // const showEasyBet =
  //   currentPlayer && easyBettingOptions[0]!.amount < currentPlayer.chips;

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId || undefined, user.username),
    {
      share: true,
    },
  );

  const formatDisplayValue = (
    amount: number,
    potSize: number,
    postFlop = false,
  ): string => {
    if (postFlop && potSize > 0) {
      const percentage = (amount / potSize) * 100;
      return `${percentage.toFixed(0)}%`; // Round to whole number for clarity
    }

    if (displayBB) {
      const bbValue = amount / initialBigBlind;
      return `${parseFloat(bbValue.toFixed(2))} BB`; // Removes trailing zeros
    } else {
      const formattedChips = new Intl.NumberFormat("en-US").format(
        amount / 100,
      ); // Adjust for cents
      return formattedChips;
    }
  };

  useEffect(() => {
    if (gameState.gameStage === "preFlop") {
      setFoldToAny(false);
      foldToAnyCopy = false;
    }
  }, [gameState.gameStage]);

  // Update raiseAmount when gameStage or minRaiseAmount changes
  useEffect(() => {
    // Reset raiseAmount to the minimum raise amount or to 0 if there's no minRaiseAmount
    const initialRaiseAmount = Math.min(
      gameState?.minRaiseAmount,
      currentPlayer?.chips + currentPlayer?.bet,
    );
    setRaiseAmount(initialRaiseAmount);
    setInputValue((initialRaiseAmount / 100).toString()); // Reset inputValue as well
  }, [gameState?.gameStage, gameState?.minRaiseAmount]);

  useEffect(() => {
    if (isPlayerTurn && foldToAny && foldToAnyCopy && !canCheck) {
      setInactivityCount(0);
      setActionButtonsDisabled(true);
      setFoldToAny(false);
      sendPokerMessage(sendJsonMessage, {
        action: "sendPokerAction",
        gameAction: "playerFold",
        gameId: "",
        raiseAmount: null,
        buyIn: null,
        groups: null,
      });
    }
  }, [gameState.currentTurn]);

  return (
    <View>
      {!isPlayerTurn && !hasFolded && !gameIsOver && (
        <View style={styles.absoluteBottom}>
          <Button
            variant={"empty"}
            style={[
              styles.button,
              foldToAny ? styles.activeButton : styles.inactiveButton,
            ]}
            textStyle={{textAlign: 'center'}}
            onPress={() => setFoldToAny(!foldToAny)}
          >
            <Text style={foldToAny ? styles.activeText : styles.inactiveText}>
              {canCheck ? (
                <Text>
                  Fold {"\n"} to any bet
                </Text>
              ) : (
                "Fold"
              )}
            </Text>
          </Button>
        </View>
      )}
      {gameIsOver && hasCards && !mustShowCards && (
        <View style={styles.showCardControls}>
          <ShowCardControls
            gameId={gameId}
            firstCardName={firstCardName}
            secondCardName={secondCardName}
          />
        </View>
      )}
      {!gameIsOver && isPlayerTurn && !(foldToAnyCopy && gameState.highestBet > currentPlayer.bet) && (
        <View style={styles.playerTurnContainer}>
          {isPlayerTurn && thisPlayer?.extraTime === 0 && screenSize === "smallIphone" && (
            <TimeBank player={currentPlayer} gameId={gameState.gameId} />
          )}

          <View style={styles.bettingOptionsContainer}>
            <View style={styles.bettingOptions}>
              {screenSize !== "smallIphone" &&
                easyBettingOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={"bet"}
                    style={styles.betButton}
                    disabled={
                      option.amount < gameState.minRaiseAmount ||
                      option.amount > currentPlayer.chips ||
                      actionButtonsDisabled
                    }
                    onPress={() => {
                      setRaiseAmount(option.amount);
                      setInputValue((option.amount / 100).toString());
                    }}
                  >
                    {formatDisplayValue(
                      option.amount,
                      gameState.pot,
                      gameState.gameStage !== "preFlop",
                    )}{" "}
                  </Button>
                ))}
            </View>

            {gameState.minRaiseAmount < currentPlayer.chips + currentPlayer.bet && currentPlayer.canRaise && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={displayBB ? Number(inputValue) / initialBigBlind * 100 : inputValue}
                  onChangeText={(text: any) => {
                    const value = text.replace(/,/g, "").trim(); // Remove commas and extra spaces
                    setInputValue(value); // Always update the input state for UI display

                    const parsedValue = parseFloat(value);
                    if (!isNaN(parsedValue)) {
                      let adjustedValue;

                      if (displayBB) {
                        // Convert BB to Chips for internal state
                        adjustedValue = parsedValue * initialBigBlind;
                      } else {
                        // Parse Chips directly (multiply by 100 to convert to cents)
                        adjustedValue = parsedValue * 100;
                      }

                      // Clamp the value between minRaiseAmount and available chips
                      setRaiseAmount(
                        Math.min(
                          Math.max(
                            gameState.minRaiseAmount,
                            Math.floor(adjustedValue),
                          ),
                          currentPlayer.chips + currentPlayer.bet,
                        ),
                      );
                    }
                  }}
                  onBlur={() => {
                    // On blur, reformat the input value based on displayBB
                    if (displayBB) {
                      const formattedBB = (raiseAmount / initialBigBlind)
                        .toFixed(2)
                        .replace(/\.00$/, ""); // Remove trailing zeros
                      setInputValue(formattedBB);
                    } else {
                      const formattedChips = (
                        raiseAmount / 100
                      ).toLocaleString("en-US"); // Format as a string with commas
                      setInputValue(formattedChips);
                    }
                  }}
                />
              </View>
            )}

            <View style={styles.sliderContainer}>
              {gameState.minRaiseAmount < currentPlayer.chips + currentPlayer.bet && currentPlayer.canRaise && (
                <TooltipSlider
                  tipFormatter={(value: any) => `${value}`}
                  min={gameState.minRaiseAmount}
                  max={currentPlayer?.chips + currentPlayer?.bet}
                  value={Math.max(gameState.minRaiseAmount, raiseAmount)} // Ensure the slider never shows values below the min
                  onChange={(value: any) => {
                    if (typeof value === "number") {
                      setRaiseAmount(value);
                      setInputValue((value / 100).toString()); // Update input field when slider changes
                    }
                  }}
                />
              )}
            </View>
          </View>
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtons}>
              <Fold
                disabled={actionButtonsDisabled}
                onPress={() => {
                  setInactivityCount(0);
                  setFoldToAny(false);
                  sendPokerMessage(sendJsonMessage, {
                    action: "sendPokerAction",
                    gameAction: "playerFold",
                    gameId: "",
                    raiseAmount: null,
                    buyIn: null,
                    groups: null,
                  });
                }}
              />
              {gameState?.currentTurn ===
                gameState?.players.find((player) => player.id === playerId)?.position &&
              gameState?.players.find((player) => player.id === playerId)?.bet === gameState?.highestBet ? (
                <Check
                  disabled={actionButtonsDisabled}
                  onPress={() => {
                    setInactivityCount(0);
                    setFoldToAny(false);
                    sendPokerMessage(sendJsonMessage, {
                      action: "sendPokerAction",
                      gameAction: "playerCheck",
                      gameId: "",
                      raiseAmount: null,
                      buyIn: null,
                      groups: null,
                    });
                  }}
                />
              ) : (
                <Call
                  disabled={actionButtonsDisabled}
                  amountToCall={gameState.highestBet - currentPlayer.bet}
                  goingAllIn={
                    gameState.highestBet - currentPlayer.bet >
                    currentPlayer.chips
                  }
                  onPress={() => {
                    setInactivityCount(0);
                    setFoldToAny(false);
                    sendPokerMessage(sendJsonMessage, {
                      action: "sendPokerAction",
                      gameAction: "playerCall",
                      gameId: "",
                      raiseAmount: null,
                      buyIn: null,
                      groups: null,
                    });
                  }}
                  displayBB={displayBB}
                  initialBigBlind={initialBigBlind}
                >
                  {formatDisplayValue(
                    raiseAmount,
                    gameState.pot,
                    gameState.gameStage !== "preFlop",
                  )}
                </Call>
              )}
              {!gameIsOver &&
                gameState.highestBet < currentPlayer.chips + currentPlayer.bet &&
                currentPlayer.canRaise && (
                  <Raise 
                    raiseAmount={
                      (raiseAmount ?? gameState.minRaiseAmount) / 100
                    } 
                    isGoingAllIn={
                      currentPlayer.chips <=
                        gameState.highestBet - currentPlayer.bet ||
                      currentPlayer.chips + currentPlayer.bet <=
                        gameState?.minRaiseAmount
                    } 
                    displayBB={displayBB} 
                    initialBigBlind={initialBigBlind} 
                    onPress={() => {
                      setInactivityCount(0);
                      setFoldToAny(false);
                      sendPokerMessage(sendJsonMessage, {
                        action: "sendPokerAction",
                        gameAction: "playerRaise",
                        gameId: "",
                        raiseAmount: raiseAmount,
                        buyIn: null,
                        groups: null,
                      });
                    }}   
                    isBet={gameState?.highestBet === 0}   
                    disabled={
                      actionButtonsDisabled ||
                      !currentPlayer.canRaise ||
                      raiseAmount <
                        Math.min(
                          gameState?.minRaiseAmount,
                          currentPlayer?.chips + currentPlayer?.bet,
                        )
                    }            
                  >
                    {formatDisplayValue(
                      raiseAmount,
                      gameState.pot,
                      gameState.gameStage !== "preFlop",
                    )}
                  </Raise>
                )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteBottom: {
    position: 'absolute',
    bottom: -20,
    right: -20,    
    transform: [{ translateX: -50 }, { translateY: 100 }],
  },
  button: {
    height: 50,
    width: 90,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#464A52',
    paddingHorizontal: 10,
    paddingVertical: 16
  },
  activeButton: {
    borderColor: '#1E90FF',
    backgroundColor: '#1E90FF',
  },
  inactiveButton: {
    borderColor: '#464A52',
    backgroundColor: '#282c34',
  },
  activeText: {
    color: '#fff700',
    fontSize: 13
  },
  inactiveText: {
    color: 'white',
    fontSize: 13
  },
  showCardControls: {
    position: 'absolute',
    bottom: -40,
    left: '10%',
    width: '80%',
    right: 70, // Default right position for medium screens
    transform: [
        { translateX: -50 }, // Move left by 50% of width
        { translateY: 100 }, // Move down by 100% of height
    ],
  },
  playerTurnContainer: {
    position: 'absolute',
    bottom: -160,
    // right: 25,
    height: 124,
    // left: '50%',
    width: '80%',
    maxWidth: 600,
    transform: [{translateX: 50}],
    display: 'flex'
  },
  bettingOptionsContainer: {
    // marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 882,
  },
  bettingOptions: {
    flexDirection: 'row'
  },
  betButton: {
    width: 20,
    borderColor: '#464A52',
    fontSize: 12,
  },
  inputContainer: {
    position: 'absolute',
    left: '26%',
    top: 0,
    width: '22%',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'gray',
    backgroundColor: 'transparent',
    paddingHorizontal: 2,
    paddingVertical: 1,
    textAlign: 'center',
    color: 'white',
    height: 40
  },
  sliderContainer: {
    position: 'absolute',
    width: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    left: '55%',
    top: -10
  },
  actionButtonsContainer: {
    marginTop: 45,
    flexDirection: 'column'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
});


export default BettingControls;
