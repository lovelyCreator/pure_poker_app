import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { CardFaceUp } from './CardFaceIUp';
import { CardFaceDown } from "./CardFaceDown";

interface CardProps {
  card: string | null; // Card data, null means face down
  boardCard?: boolean | null;
  side: "left" | "right" | "none"; // 'none' is for board cards
  isCurrentPlayer: boolean; // isCurrentPlayer means the player playing currently
  gameIsOver: boolean;
  hasFolded: boolean;
  handDescription?: string | null;
  index: number;
  isAnimating?: boolean;
  startPos?: { x: number; y: number };
  endPos?: { x: number; y: number };
  duration?: number;
  bestHand: string[] | null;
  showCards?: boolean[] | null;
  shouldShowWin?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  side,
  isCurrentPlayer,
  gameIsOver,
  hasFolded,
  index,
  handDescription,
  bestHand,
  showCards = [false, false],
  isAnimating = false,
  startPos,
  endPos,
  duration = 1,
  shouldShowWin = false,
}) => {
  const opponentMustShowCards = !isCurrentPlayer && gameIsOver && !hasFolded && card && handDescription;

  // Define the 3D flip animation variants
  const flipAnimation = {
    hidden: { rotateY: 0 }, // Initially, no rotation (CardFaceDown)
    visible: {
      rotateY: 180, // Flip to 180 degrees (CardFaceUp)
      transition: {
        delay: 1,
        duration: 1, // Flip animation duration
        type: "timing", // Smooth easing
      },
    },
  };

  const renderCard = () => {
    if (card && (side === "none" || isCurrentPlayer)) {
      const value = card.slice(0, -1).replace("T", "10");
      const suite = card.slice(-1);
      return (
        <CardFaceUp
          side={side}
          suite={suite}
          value={value}
          gameIsOver={gameIsOver}
          bestHand={bestHand}
          card={card}
          shouldShowWin={shouldShowWin}
        />
      );
    } else if (opponentMustShowCards) {
      const value = card.slice(0, -1).replace("T", "10");
      const suite = card.slice(-1);
      return (
        // <MotiView
        //   from={flipAnimation.hidden}
        //   animate={flipAnimation.visible}
        <View
          style={styles.cardContainer}
        >
          {/* Back side (CardFaceDown) */}
          {/* <MotiView  */}
          <View
          style={styles.cardSide}>
            <CardFaceDown side={side} />
          {/* </MotiView> */}
          </View>

          {/* Front side (CardFaceUp) */}
          {/* <MotiView  */}
          <View
          style={[styles.cardSide, styles.frontSide]}>
            <CardFaceUp
              side={side}
              suite={suite}
              value={value}
              gameIsOver={gameIsOver}
              bestHand={bestHand}
              card={card}
              shouldShowWin={shouldShowWin}
            />
            </View>
          {/* </MotiView> */}
        {/* </MotiView> */}
        </View>
      );
    } else if (!isCurrentPlayer && gameIsOver && showCards) {
      if (card) {
        const value = card.slice(0, -1).replace("T", "10");
        const suite = card.slice(-1);

        const revealCardAnimation = {
          initial: { opacity: 0.8, scale: 1 },
          animate: {
            opacity: 1,
            scale: 1.1,
          },
          transition: { duration: 0.8, type: "timing" },
        };

        let leftValue = "0px";
        if (showCards[0] && showCards[1]) {
          leftValue = index === 0 ? "0px" : "90px";
        } else if (showCards[0] || showCards[1]) {
          leftValue = "33px";
        }

        const cardStyle = {
          zIndex: 1000,
          position: "absolute",
          opacity: 1,
          left: leftValue,
        } as React.CSSProperties;

        return (
          // <MotiView {...revealCardAnimation} 
          <View
          style={cardStyle}>
            <CardFaceUp
              side={side}
              suite={suite}
              value={value}
              gameIsOver={gameIsOver}
              bestHand={bestHand}
              card={card}
              shouldShowWin={shouldShowWin}
            />
          {/* </MotiView> */}
          </View>
        );
      }
      return null;
    } else if (!isCurrentPlayer && !gameIsOver && !hasFolded) {
      return <CardFaceDown side={side} />;
    } else if (card && !isCurrentPlayer && !hasFolded && gameIsOver && handDescription) {
      const value = card.slice(0, -1).replace("T", "10");
      const suite = card.slice(-1);
      return (
        <CardFaceUp
          side={side}
          suite={suite}
          value={value}
          gameIsOver={gameIsOver}
          bestHand={bestHand}
          card={card}
          shouldShowWin={shouldShowWin}
        />
      );
    } else {
      return <CardFaceDown side={side} />;
    }
  };

  return (
    // <MotiView
    //   from={isAnimating ? startPos : undefined}
    //   animate={isAnimating ? endPos : undefined}
    <View
      style={styles.cardContainer}
    >
      {renderCard()}
    {/* </MotiView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    height: 60,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden', // Hide the back when the card is flipped
  },
  frontSide: {
    transform: [{ rotateY: '180deg' }], // Flip the front face
  },
});

export default Card;
