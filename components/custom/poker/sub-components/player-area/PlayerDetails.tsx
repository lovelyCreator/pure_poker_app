import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenSize, usernameLengthToFontSize, chipsToBB } from "@/lib/poker";
import PlayerAvatar from "./PlayerAvatar";
import PlayerTimeBar from "./PlayerTimeBar";

interface PlayerDetailsProps {
  playerId: string;
  playerChips: number;
  playerName: string;
  profilePicture: string;
  isCurrentPlayer: boolean;
  isCurrentTurn: boolean;
  hasFolded: boolean;
  gameIsOver: boolean;
  shouldShowWin: boolean;
  sittingOut: boolean;
  timeBarWidth: number;
  hasExtraTime: boolean;
  screenSize: ScreenSize;
  displayBB: boolean;
  initialBigBlind: number;
  handsPlayed: number;
  vpip: number;
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({
  playerId,
  playerChips,
  playerName,
  profilePicture,
  isCurrentPlayer,
  isCurrentTurn,
  hasFolded,
  gameIsOver,
  shouldShowWin,
  sittingOut,
  timeBarWidth,
  hasExtraTime,
  screenSize,
  displayBB,
  initialBigBlind,
  handsPlayed,
  vpip,
}) => {
  // Determine display value based on `displayBB` state
  const displayValue = displayBB
    ? `${chipsToBB(playerChips, initialBigBlind).toFixed(2)} BB`
    : `${playerChips}`;

  //Determin VPIP background color
  const vpipColor = 
    vpip > 50 
      ? "#22C55E" 
      : vpip > 35
      ? "#3B82F6"
      : vpip > 20
      ? "#F97316"
      : "#EF4444"
  const vpipFont = Math.round(vpip) === 100 ? 8 : 10;
  const calculateFontSize = (word:string, maxWidth:number) => {
    const baseFontSize = 20; // Base font size
    const wordLength = word.length;
  
    // Calculate font size based on word length
    const newFontSize = Math.max(baseFontSize * (maxWidth / (wordLength * 10)), 10); // Minimum font size of 10
    return newFontSize;
  };
  return (
    <View style={styles.container}>

    {/* VPIP Indicator */}
    {handsPlayed > 0 && !isCurrentPlayer && !gameIsOver && !sittingOut && (
      <View
        style={{ 
          transform: [{translateX: -50}, {translateY: -50}], position: 'absolute', left: 30, top: 90, zIndex: 50, 
          display: 'flex', height: 24, width: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: vpipColor
        }}
      >
        <Text style={{color: 'white', fontSize: vpipFont, fontWeight: 'bold'}}>
          {Math.round(vpip)}%
        </Text>
      </View>
    )}
      <PlayerAvatar playerId={playerId} profilePicture={profilePicture} />

      <View style={styles.detailsContainer}>
        <Text
          style={[
            styles.playerName,
            { color: isCurrentPlayer ? "#FFF700" : "#FFFFFF" },
            {fontSize: 10}
            // {fontSize: calculateFontSize(playerName, 50)}
            // { fontSize: usernameLengthToFontSize(playerName.length, screenSize) },
          ]}
        >
          {playerName}
        </Text>

        <Text style={styles.chipsDisplay}>
          {!gameIsOver
            ? displayValue
            : shouldShowWin || hasFolded
            ? displayValue
            : "..."}
        </Text>

        {sittingOut && (
          <Text style={styles.sittingOutText}>sitting out</Text>
        )}
      </View>

      {/* Time Bar */}
      {isCurrentTurn && (
        <PlayerTimeBar
          hasExtraTime={hasExtraTime}
          timeBarWidth={timeBarWidth}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'column',
    marginTop: 30,
  },
  detailsContainer: {
    marginTop: -14,
    width: 85,
    overflow: "hidden",
    paddingTop: 3,
    borderColor: "#ffffff1a",
    borderRadius: 10,
    backgroundColor: "#1c202b",
    position: "relative",
    zIndex: 30,
  },
  playerName: {
    marginTop: -10,
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  chipsDisplay: {
    borderTopWidth: 1,
    borderColor: "#ffffff1a",
    textAlign: "center",
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 16,
    color: '#ffffff99'
  },
  sittingOutText: {
    borderTopWidth: 1,
    borderColor: "#ffffff1a",
    textAlign: "center",
    paddingVertical: 5,
    color: "#1F85EF",
    fontSize: 13,
  },
});

export default PlayerDetails;
