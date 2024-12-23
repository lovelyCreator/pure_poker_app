import { ScreenSize } from "@/lib/poker";
import { Player } from "@/types/poker";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface InformationBannerProps {
  isSittingOut: boolean;
  isSittingOutNextHand: boolean;
  inactivityCount: number;
  currentPlayer: Player | null;
  isSpectator: boolean;
  screenSize: ScreenSize;
}

const InformationBanner: React.FC<InformationBannerProps> = ({
  isSittingOut,
  isSittingOutNextHand,
  inactivityCount,
  currentPlayer,
  isSpectator,
  screenSize
}) => {
  // Don't show any banner if the player is in buyBackIn state
  if (currentPlayer?.chips === 0) return null;
  // console.log("SitOutState ====> ", isSittingOut, !isSittingOutNextHand, inactivityCount)

  return (
    <View style={styles.container}>
      {/* Inactivity warning */}
      {!isSittingOut && !isSittingOutNextHand && inactivityCount > 2 && !isSpectator && (
        <View style={styles.inactivityWarning}>
          <Text style={styles.warningText}>
            Inactivity warning! {"\n"}Make a move to not get kicked out of the game.
          </Text>
        </View>
      )}

      {/* Sitting out and next hand */}
      {isSittingOut && isSittingOutNextHand && !isSpectator && (
        <View style={[styles.banner, styles.sittingOut]}>
          <Text style={styles.bannerText}>Currently sitting out.</Text>
        </View>
      )}

      {/* Set to sit out next hand */}
      {isSittingOutNextHand && !isSittingOut && !isSpectator && (
        <View style={[styles.banner, styles.sitOutNextHand]}>
          <Text style={styles.bannerText}>Sitting out next hand.</Text>
        </View>
      )}

      {/* Set to come back next hand */}
      {!isSittingOutNextHand && isSittingOut && !currentPlayer?.needsToWait && !isSpectator && (
        <View style={[styles.banner, styles.comingBack]}>
          <Text style={styles.bannerText}>Coming back next hand!</Text>
        </View>
      )}

      {/* Cannot join as the button */}
      {!isSittingOutNextHand && isSittingOut && currentPlayer?.needsToWait && !isSpectator && (
        <View style={[styles.banner, styles.cannotJoin]}>
          <Text style={styles.bannerText}>
            Can't join as the button {"\n"} Coming back next hand.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: 'relative',
  },
  inactivityWarning: {
    position: 'absolute',
    left: '50%',
    top: 100,
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 10,
    zIndex: 10,
  },
  banner: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  sittingOut: {
    top: 115,
    backgroundColor: 'rgba(247, 141, 80, 0.4)',
  },
  sitOutNextHand: {
    top: 115,
    backgroundColor: 'rgba(31, 133, 239, 0.4)',
  },
  comingBack: {
    top: 115,
    backgroundColor: 'rgba(34, 197, 93, 0.4)',
  },
  cannotJoin: {
    top: 115,
    backgroundColor: 'rgba(34, 197, 93, 0.4)',
  },
  warningText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default InformationBanner;
