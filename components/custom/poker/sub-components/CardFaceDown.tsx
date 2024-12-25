import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface CardFaceDownProps {
  side: "left" | "right" | "none";
  style?: React.CSSProperties;
  isDealing ?: boolean;
}

export const CardFaceDown: React.FC<CardFaceDownProps> = ({ side, isDealing }) => {
  let rotateStyle = {};
  if (isDealing) {
    if (side === "left") {
      rotateStyle = { transform: [{ rotate: "-7deg" }] };
    } else if (side === "right") {
      rotateStyle = { transform: [{ rotate: "6deg" }] };
    } 
  }

  const marginRight = side === "none" ? 0 : -16;

  return (
    <View
      style={[
        styles.cardContainer,
        rotateStyle,
        { marginRight },
        isDealing ? {width: 45, height: 60, borderRadius: 10} : {width: 30, height: 40, borderRadius: 2}
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
    // height: 60,
    // width: 45,
    // borderRadius: 10,
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
