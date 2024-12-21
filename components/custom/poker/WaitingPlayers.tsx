import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenSize, usernameLengthToFontSize, generatePlayerPositions } from "@/lib/poker";
import PlayerAvatar from "./sub-components/player-area/PlayerAvatar";

interface WaitingPlayerProps {
  waitingPlayers: (string | number)[][];
  playerId: string;
  playerCount: number;
  screenSize: ScreenSize;
}

const WaitingPlayers: React.FC<WaitingPlayerProps> = ({ 
  waitingPlayers, 
  playerId, 
  playerCount,
  screenSize
}) => {
    const playerPositions = generatePlayerPositions(screenSize);
    const totalPlayerCount = Math.min(playerCount + waitingPlayers.length, 9);

    return (
        <>
        {waitingPlayers.map((waitingPlayer, i) => {
            const [waitingPlayerUuid, waitingPlayerBuyIn, waitingPlayerUsername, waitingPlayerProfilePicture] = waitingPlayer as [string, number, string, string];

            const positionIndex = (playerCount + i) % 9;
            const positionBis = playerPositions[totalPlayerCount - 1]?.[positionIndex];

            return (
            <View
                key={waitingPlayerUuid}
                style={{
                    position: 'absolute',
                    zIndex: 10,
                    left: positionBis?.leftPosition,
                    top: positionBis?.topPosition,
                    transform: [{ translateX: -50 }, { translateY: -50 }],
                }}
            >
                {playerCount + i <= 9 && (
                    <View style={styles.playerContainer}>
                        <PlayerAvatar playerId={playerId} profilePicture={waitingPlayerProfilePicture} />
                        <View
                            style={styles.usernameContainer}
                        >
                            <View style={styles.innerUsernameContainer}>
                            <Text
                                style={[
                                    styles.usernameText,
                                    { color: waitingPlayerUsername === playerId ? "#fff700" : "white" },
                                    usernameLengthToFontSize(waitingPlayerUsername.length, screenSize),
                                ]}
                            >
                                {waitingPlayerUsername}
                            </Text>
                            <Text
                                style={styles.buyInText}
                            >
                                {waitingPlayerBuyIn / 100}
                            </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
            );
        })}
        </>
    );
};

const styles = StyleSheet.create({
    playerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    usernameContainer: {
        zIndex: 10,
        marginTop: -14,
        paddingTop: 3,
        borderColor: '#ffffff1a',
        borderWidth: 1, // Specify border width
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden', // Ensures child elements don't overflow
    },
    innerUsernameContainer: {
        backgroundColor: '#ffffff1a', // Background color for the inner container
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 100, // Adjust height as needed        
    },
    usernameText: {
        marginTop: -10,
        width: 85,
        paddingHorizontal: 3,
        paddingVertical: 1,
        marginBottom: 0,
        backgroundColor: '#1c202b',
    },
    buyInText: {
        width: 85,
        borderTopWidth: 1,
        paddingBottom: 1,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#1c202b',
        borderColor: "#ffffff1a",
    },
});

export default WaitingPlayers;
