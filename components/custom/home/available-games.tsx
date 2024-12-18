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

interface AvailableGamesHomeProps {
  availableGame: AvailableGame;
  userIsVerified: boolean;
}

const AvailableGamesHome: React.FC<AvailableGamesHomeProps> = ({
  availableGame,
  userIsVerified,
}) => {
  const navigation = useNavigation();

  const handleJoinClick = () => {
    // navigation.navigate("PlayPoker", { gameId: availableGame.gameId });
    console.log('Join')
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.gameId}>{availableGame.gameId}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/home/game-board.png')} // Adjust the path as needed
            style={styles.image}
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
  },
  image: {
    height: "auto",
    width: "90%",
  },
  playerCountContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
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
