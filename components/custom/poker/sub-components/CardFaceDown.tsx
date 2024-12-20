import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface CardFaceDownProps {
  side: "left" | "right" | "none";
  style?: React.CSSProperties;
}

export const CardFaceDown: React.FC<CardFaceDownProps> = ({ side }) => {
  let rotateStyle = {};
  if (side === "left") {
    rotateStyle = { transform: [{ rotate: "-7deg" }] };
  } else if (side === "right") {
    rotateStyle = { transform: [{ rotate: "6deg" }] };
  }

  const marginRight = side === "none" ? 0 : -6;

  return (
    <View
      style={[
        styles.cardContainer,
        rotateStyle,
        { marginRight },
      ]}
    >
      <Image
        source={require('@/assets/game/card-faceDown-desktop.png')}
        style={styles.cardImage}
        accessibilityLabel="Card Face Down"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    height: 60,
    width: 45,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default CardFaceDown;
