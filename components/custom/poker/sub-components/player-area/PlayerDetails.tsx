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

  return (
    <View style={styles.container}>

    {/* VPIP Indicator */}
    {handsPlayed > 0 && !isCurrentPlayer && !gameIsOver && !sittingOut && (
      <View
        className={`absolute left-4 md:left-4 mt-4 md:mt-6 lg:mt-5 z-20 flex h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 items-center justify-center rounded-lg text-white ${vpipFont} font-bold ${vpipColor}`}
        style={{ 
          transform: "translate(-50%, -50%)", position: 'absolute', left: 16, marginTop: 16, zIndex: 20, 
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
    flexDirection: 'column'
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
    zIndex: 80,
  },
  playerName: {
    marginTop: -10,
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 10,
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
