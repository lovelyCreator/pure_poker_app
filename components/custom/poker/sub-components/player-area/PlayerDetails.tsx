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
}) => {
  // Determine display value based on `displayBB` state
  const displayValue = displayBB
    ? `${chipsToBB(playerChips, initialBigBlind).toFixed(2)} BB`
    : `${playerChips}`;

  return (
    <View style={styles.container}>
      <PlayerAvatar playerId={playerId} profilePicture={profilePicture} />

      <View style={styles.detailsContainer}>
        <Text
          style={[
            styles.playerName,
            { color: isCurrentPlayer ? "#FFF700" : "#FFFFFF" },
            {fontSize: 14}
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
