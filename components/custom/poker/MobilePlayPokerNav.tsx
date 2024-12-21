import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Icons for menu open/close
import { GameState } from "@/types/poker";
import GameSharePopup from "./sub-components/social/GmaeSharePopup";
import QuitGamePopup from "./sub-components/navbar-area/QuitGamePopup";
import BuyChipsPopup from "./sub-components/BuyChipsPopup";
import SitOutPopUp from "./sub-components/navbar-area/SitOutPopUp";
import SettingsPopup from "./sub-components/settings.tsx/SettingPopup";
import { Text, View, StyleSheet, Image } from "react-native";
import { Button } from "@/components/ui/button";

interface MobilePlayerPokerNavProps {
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

const MobilePlayerPokerNav: React.FC<MobilePlayerPokerNavProps> = ({
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  const winnings = gameChips - buyIn;
  
  // Handle when to show BuyBackInPopup
  const player = gameState?.players.find((player) => player.id === playerId);
  const gameIsOver = gameState?.gameStage === "gameOver";
  const isPlayerWaitingInGame = gameState?.waitingPlayers.some(
    (player) => player[2] === playerId
  );
  const showBuyBackInPopUp =
    gameChips === 0 &&
    player?.boughtChips === 0 &&
    (player?.sittingOut ||
      gameState?.gameStage === "gameOver" ||
      gameState?.gameStage === "preDealing");

  useEffect(() => {
    if (gameIsOver && allBoardCardsRevealed && showBuyBackInPopUp) {
      const timer = setTimeout(() => {
        setShouldShowPopup(true);
      }, 6000); // Delay before showing popup

      return () => clearTimeout(timer);
    } else {
      setShouldShowPopup(false);
    }
  }, [gameIsOver, allBoardCardsRevealed, showBuyBackInPopUp]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <View style={styles.container}>
      {/* Mobile menu toggle button */}
      
        {!isMobileMenuOpen && <Button style={styles.toggleButton} onPress={toggleMobileMenu}>
          <Menu size={24} />
      </Button>}

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <View style={styles.menuOverlay}>
          <View style={styles.menuContent}>
            {/* Mobile menu content */}
            <View style={styles.header}>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>
                  <Image source={require('@/assets/home/icon/coin.png')} style={styles.coinImage} />
                  {new Intl.NumberFormat("en-US").format(playerBalance)}
                </Text>
              </View>
              {/* Quit Game Popup */}
              {!isSpectator && <QuitGamePopup />}
              <Button onPress={toggleMobileMenu}>
                <X size={24} />
              </Button>
            </View>

            {/* Game Share Popup */}
            <View style={styles.shareSettingsContainer}>
              <GameSharePopup gameId={gameId} />
              <SettingsPopup
                displayBB={displayBB}
                setDisplayBB={setDisplayBB}
                playSoundEnabled={playSoundEnabled}
                setPlaySoundEnabled={setPlaySoundEnabled}
              />
            </View>

            <View style={styles.infoContainer}>
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

            <View style={styles.actionContainer}>
              {/* Sit Out Popup */}
              {!isSpectator && !isPlayerWaitingInGame && !((player?.sittingOut ?? gameState?.gameStage === "gameOver") && gameChips === 0) && (
                <SitOutPopUp
                  isSittingOutNextHand={isSittingOutNextHand}
                  setIsSittingOutNextHand={setIsSittingOutNextHand}
                />
              )}

              {/* Buy Chips Popup */}
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
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  toggleButton: {
    position: 'absolute',
    zIndex: 100,
    top: 10,
    right: 10,
    color: 'white',
  },
  menuOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContent: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: 256,
    backgroundColor: '#11141D',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    color: '#FFC105',
    top: 0
  },
  balanceText: {
    display: 'flex',
    flexDirection: 'row',
    color: '#FFC105',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14
  },
  coinImage: {
    marginRight: 8,
    height: 24,
    width: 24,
  },
  shareSettingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoContainer: {
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#212530B2',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    width: 180,
    gap: 5
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  labelText: {
    color: '#ffffffb3',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


export default MobilePlayerPokerNav;
