import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AvailableGame } from "@/types/poker"; // Ensure this type is compatible with React Native
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('screen').width * 0.6;

interface AvailableGamesHomeProps {
  availableGame: AvailableGame;
  userIsVerified: boolean;
}

const AvailableGamesHome: React.FC<AvailableGamesHomeProps> = ({
  availableGame,
  userIsVerified,
}) => {
  let len = 5;
  if (availableGame.maxPlayers >= 5 ) len = 5
  else len = availableGame.maxPlayers;
  const spotWidth = screenWidth  / len - 10;
  const navigation = useNavigation();

  const handleJoinClick = () => {
    navigation.navigate("playPoker", { gameId: availableGame.gameId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.gameId}>{availableGame.gameId}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/home/game-board.png')} // Adjust the path as needed
            style={{
              width: '90%',
              height: 200
            }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.playerCountContainer}>
          {Array.from({ length: availableGame.maxPlayers })
            .slice(0, 5)
            .map((_, index) => (
              <View
                key={index}
                style={[
                  styles.playerIndicator,
                  {
                    backgroundColor:
                      index < availableGame.playerCount
                        ? "#2085F0"
                        : "#4B5563", // gray-700
                    width: `${100/len - 1}%`,
                  },
                ]}
              />
            ))}
        </View>
        <Text style={styles.spotsLeft}>
          {availableGame.maxPlayers - availableGame.playerCount} Spots left
        </Text>
        <TouchableOpacity
          onPress={handleJoinClick}
          style={[
            styles.button,
            {
              borderColor: availableGame.isUserInGame
                ? "green"
                : "#45A1FF",
              backgroundColor: availableGame.isUserInGame
                ? "green"
                : "#2085F0",
            },
          ]}
        >
          <Text style={styles.buttonText}>
            {availableGame.isUserInGame
              ? "Access"
              : userIsVerified
              ? "Join"
              : "Spectate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4B5563", // gray-700
    backgroundColor: "#1F2937", // gray-800
    padding: 20,
    alignItems: "center",
  },
  gameId: {
    fontSize: 18,
    color: "white",
    marginBottom: 16,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%'
  },
  playerCountContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#1F2937',
    width: '90%',
    justifyContent: 'space-between'
  },
  playerIndicator: {
    height: 8,
    width: "80%",
    borderRadius: 4,
  },
  spotsLeft: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 12,
    color: "#A1A1A1", // gray-400
  },
  button: {
    marginTop: 16,
    width: "90%",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default AvailableGamesHome;
