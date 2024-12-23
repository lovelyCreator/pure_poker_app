import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CardFaceUpProps {
  side: "left" | "right" | "none";
  suite: string;
  value: string;
  gameIsOver: boolean;
  boardCard?: boolean | null;
  bestHand: string[] | null;
  card: string;
  shouldShowWin?: boolean;
  noRotation?: boolean;
}

const suiteToColor: Record<string, string> = {
  "♥": "red",
  "♦": "blue",
  "♠": "black",
  "♣": "green",
};

export const CardFaceUp: React.FC<CardFaceUpProps> = ({
  side,
  suite,
  value,
  gameIsOver,
  boardCard,
  bestHand,
  card,
  shouldShowWin = false,
  noRotation = false,
}) => {
  let rotateStyle = {};
  if (side === "left") {
    rotateStyle = { transform: [{ rotate: "-7deg" }] };
  } else if (side === "right") {
    rotateStyle = { transform: [{ rotate: "5deg" }] };
  }
  if (noRotation) {
    rotateStyle = {};
  }

  const marginRight = side === "none" ? 0 : -6;

  let backgroundColor = "white";
  let animationStyle: React.CSSProperties = {};
  let cardOpacity = 1;

  if (gameIsOver && shouldShowWin) {
    if (bestHand && bestHand.includes(card)) {
      backgroundColor = "yellow";
      animationStyle = {
        backgroundSize: "200% auto",
        animation: "shine 1s ease-in-out infinite",
        boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.5)",
      };
    } else if (boardCard) {
      cardOpacity = 0.8;
    }
  }

  return (
    <View
      style={[
        styles.cardContainer,
        rotateStyle,
        { backgroundColor, opacity: cardOpacity, marginRight },
      ]}
    >
      <View style={[styles.suiteContainer]}>
        <Text style={[styles.valueText, {color: suiteToColor[suite]}]}>{value}</Text>
        <Text style={[styles.suiteText, {color: suiteToColor[suite]}]}>{suite}</Text>
      </View>
      <View style={[styles.suiteContainer, { position: 'absolute', left: 28, top: -2 }]}>
        <Text style={[styles.suiteText, {color: suiteToColor[suite]}]}>{suite}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 45,
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  suiteContainer: {
    position: 'absolute',
    left: 5,
    top: -2,
    gap: 2
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  suiteText: {
    fontSize: 20,
  },
});

export default CardFaceUp;
