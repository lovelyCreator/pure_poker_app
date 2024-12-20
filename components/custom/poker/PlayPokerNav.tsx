import React, { useEffect, useState } from "react";
import GameSharePopup from "./sub-components/social/GmaeSharePopup";
import SettingsPopup from "./sub-components/settings.tsx/SettingPopup";
import QuitGamePopup from "./sub-components/navbar-area/QuitGamePopup";
import BuyBackInPopup from "../dialog/BuyBackInPopup";
import BuyChipsPopup from "./sub-components/BuyChipsPopup";
// import { PokerWebSocket } from "@/services/PokerWebSocket";      //OLD
import { type GameState } from "@/types/poker";
import { SpanWrapper } from "@/utils/logging";
import SitOutPopUp from "./sub-components/navbar-area/SitOutPopUp";
import { useNavigation } from "@react-navigation/native";
import MobilePlayerPokerNav from "./MobilePlayPokerNav";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

interface PlayPokerNavProps {
  gameId: string;
  playerId: string;
  gameState: GameState | undefined;
  vpip: number;
  playerBalance: number;
  buyIn: number;
  gameChips: number;
  allBoardCardsRevealed: boolean;
  setAllBoardCardsRevealed: (value: boolean) => void;
  isSpectator: boolean;
  isSittingOutNextHand: boolean;
  setIsSittingOutNextHand: (value: boolean) => void;
  displayBB: boolean;
  setDisplayBB: (value: boolean) => void;
  playSoundEnabled: boolean;
  setPlaySoundEnabled: (value: boolean) => void;
}

const PlayPokerNav = ({
  gameId,
  vpip = 0,
  playerBalance,
  gameChips,
  buyIn,
  isSpectator,
  gameState,
  playerId,
  allBoardCardsRevealed,
  setAllBoardCardsRevealed,
  isSittingOutNextHand,
  setIsSittingOutNextHand,
  displayBB, 
  setDisplayBB,
  playSoundEnabled,
  setPlaySoundEnabled
}: PlayPokerNavProps) => {
  console.log(
    'PlayPokerNav----\n',
    'gameId', gameId,
    'playerBalance', playerBalance,
    'gameChips', gameChips,
    'buyIn', buyIn,
    'isSpectator', isSpectator,
    'gameState', gameState,
    'playerId', playerId,
    'allBoardCardsRevealed', allBoardCardsRevealed,
    'isSittingOutNextHand', isSittingOutNextHand,
    'displayBB', displayBB, 
    'playSoundEnabled', playSoundEnabled,
  )
  const navigation = useNavigation();
  const [isMobile, setIsMobile] = useState(true);

  const winnings = gameChips - buyIn;

  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const player = gameState?.players.find((player) => player.id === playerId);
  const gameIsOver = gameState?.gameStage === "gameOver";
  const isPlayerWaitingInGame = gameState?.waitingPlayers.some(
    (player) => player[2] === playerId,
  );
  const showBuyBackInPopUp =
    gameChips === 0 &&
    player?.boughtChips === 0 &&
    (player?.sittingOut ||
      gameState?.gameStage === "gameOver" ||
      gameState?.gameStage === "preDealing");

  // Trigger the buy back in popup 6 seconds after all cards are revealed
  useEffect(() => {
    if (gameIsOver && allBoardCardsRevealed && showBuyBackInPopUp) {
      const timer = setTimeout(() => {
        setShouldShowPopup(true);
      }, 6000); // 6-second delay

      return () => clearTimeout(timer); // Clear the timer if component unmounts or state changes
    } else if (!gameIsOver && showBuyBackInPopUp) {
      // Immediately show the popup if the game is not over or the cards have not been revealed yet
      setShouldShowPopup(true);
    } else {
      setShouldShowPopup(false); // Reset popup state if conditions are not met
    }
  }, [gameIsOver, allBoardCardsRevealed, showBuyBackInPopUp]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };

    // Set initial mobile view and add listener for resizing
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <MobilePlayerPokerNav
        gameId={gameId}
        playerId={playerId}
        gameState={gameState}
        vpip={vpip}
        playerBalance={playerBalance}
        buyIn={buyIn}
        gameChips={gameChips}
        allBoardCardsRevealed={allBoardCardsRevealed}
        setAllBoardCardsRevealed={setAllBoardCardsRevealed}
        isSpectator={isSpectator}
        isSittingOutNextHand={isSittingOutNextHand}
        setIsSittingOutNextHand={setIsSittingOutNextHand}
        displayBB={displayBB}
        setDisplayBB={setDisplayBB}
        playSoundEnabled={playSoundEnabled}
        setPlaySoundEnabled={setPlaySoundEnabled}
      />
    );
  }

  // Desktop version
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BuyBackInPopup
          isOpen={shouldShowPopup}
          gameId={gameId}
          playerId={playerId}
          playerBalance={playerBalance}
          boughtChips={player?.boughtChips ?? 0}
          bigBlind={gameState?.initialBigBlind ?? 0}
        />
        <SpanWrapper name="QuitGamePopup">
          <View style={styles.iconContainer}>
            {isSpectator ? (
                <TouchableOpacity onPress={() => navigation.navigate("/home")}>
                    <Image
                      source={require('@/assets/menu-bar/home.png')}
                      style={styles.icon}
                    />
                </TouchableOpacity>
            ) : (
              <QuitGamePopup />
            )}
            {!isSpectator && !isPlayerWaitingInGame && !((player?.sittingOut ?? gameState?.gameStage === "gameOver") && gameChips === 0) && (
              <SitOutPopUp
                isSittingOutNextHand={isSittingOutNextHand}
                setIsSittingOutNextHand={setIsSittingOutNextHand}
              />
            )}
            {!isSpectator && !isPlayerWaitingInGame && !((player?.sittingOut ?? gameState?.gameStage === "gameOver") && gameChips === 0) && (
              <BuyChipsPopup
                gameId={gameId}
                playerId={playerId}
                playerBalance={playerBalance}
                playerChips={player?.chips ?? 0}
                boughtChips={player?.boughtChips ?? 0}
                amountBet={player?.potContribution ?? 0}
                bigBlind={gameState?.initialBigBlind ?? 0}
              />
            )}
          </View>
        </SpanWrapper>
        <View style={styles.balanceContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.labelText}>Buy-In:</Text> {buyIn / 100}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.labelText}>Winnings:</Text> {winnings < 0 ? 0 : winnings / 100}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.labelText}>VPIP:</Text> {vpip}%
            </Text>
          </View>
          <View style={styles.playerBalanceBox}>
            <View style={styles.playerBalanceContent}>
              <Text style={styles.playerBalanceText}>
                <Image
                  source={require('@/assets/home/icon/coin.png')}
                  style={styles.coinImage}
                />
                {new Intl.NumberFormat("en-US").format(playerBalance)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.popupContainer}>
          <SpanWrapper name="GameSharePopup">
            <GameSharePopup gameId={gameId} />
          </SpanWrapper>
          <SpanWrapper name="SettingsPopup">
            <SettingsPopup
              displayBB={displayBB}
              setDisplayBB={setDisplayBB}
              playSoundEnabled={playSoundEnabled}
              setPlaySoundEnabled={setPlaySoundEnabled}
            />
          </SpanWrapper>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 40,
    marginHorizontal: 'auto',
    maxWidth: 3000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e3e',
    backgroundColor: '#1c202b',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    marginHorizontal: 8,
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#161922',
    borderRadius: 50,
    padding: 8,
    gap: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
  },
  labelText: {
    opacity: 0.8,
  },
  playerBalanceBox: {
    borderRadius: 50,
    backgroundColor: '#161922',
    padding: 8,
    marginLeft: 16,
  },
  playerBalanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerBalanceText: {
    color: '#FFC105',
    fontSize: 16,
  },
  coinImage: {
    marginRight: 4,
    width: 24,
    height: 24,
  },
  popupContainer: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default PlayPokerNav;
