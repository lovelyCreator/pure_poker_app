import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface PlayerAvatarProps {
  playerId: string;
  profilePicture: string;
}

// const loadImage = (imageName: string) => {
//   try {
//     return require(`@/assets/profile/${imageName}.png`);
//   } catch (error) {
//     // Fallback to a default image if the specified one is not found
//     return require('@/assets/profile/testProfilePic.png');
//   }
// };

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ playerId, profilePicture }) => {
  // const avatarSource = loadImage(profilePicture);
  return (
  <View style={styles.container}>
    <Image
      // source={avatarSource} // Adjust the URI as necessary
      source={require('@/assets/profile/testProfilePic.png')}
      style={styles.avatar}
      accessibilityLabel="Profile Picture"
    />
  </View>
)};

const styles = StyleSheet.create({
  container: {
    marginTop: 16, // Equivalent to mt-6
    alignItems: "center",
    zIndex: 10
  },
  avatar: {
    height: 50, // Equivalent to h-[50px]
    width: 50, // Equivalent to w-[50px]
    borderWidth: 2,
    borderColor: "#5f5f5f",
    borderRadius: 25, // Half of height/width for a circular shape
  },
});

export default PlayerAvatar;
