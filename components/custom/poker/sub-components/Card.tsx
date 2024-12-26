
// Card.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { CardFaceUp } from "./CardFaceUp";
import { CardFaceDown } from "./CardFaceDown";

interface CardProps {
  card: string | null; // Card data, null means face down
  boardCard?: boolean | null;
  side: "left" | "right" | "none"; // 'none' is for board cards
  isCurrentPlayer: boolean;  // isCurrentPlayer means the player playing currently (I think)
  gameIsOver: boolean;
  hasFolded: boolean;
  handDescription?: string | null;
  index: number;
  isAnimating?: boolean;
  startPos?: { x: number; y: number };
  endPos?: { x: number; y: number };
  duration?: number;
  bestHand: string[] | null;
  style?: React.CSSProperties;
  showCards?: boolean[] | null;
  shouldShowWin?: boolean;
  isDealing?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  boardCard,
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
  isDealing
}) => {
  const CardWrapper = isAnimating ? MotiView : View;
  const animationProps = isAnimating
    ? {
        from: startPos,
        animate: endPos,
        transition: { duration },
      }
    : {};
  
  const opponentMustShowCards = !isCurrentPlayer && gameIsOver && !hasFolded && card && handDescription;
  // Define the 3D flip animation variants
  const flipAnimation = {
    from: { rotateY: 0 }, // Initially, no rotation (CardFaceDown)
    animate: {
      rotateY: 180, // Flip to 180 degrees (CardFaceUp)
    },
    transition: {
      type: 'timing',
      duration: 500, // Flip animation duration in milliseconds
      delay: 1000, // Delay before starting the animation
      easing: (t: number) => t * (2 - t), // Custom easing function for smooth animation
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
        <MotiView
        from={{ rotateY: '0deg' }}
        animate={{ rotateY: '180deg' }} // Animate to flip the card
        transition={{ type: 'timing', duration: 100 }} // Transition duration
        style={{
          height: 60,
          width: 45,
          position: 'relative',
          transformStyle: 'preserve-3d', // Enable 3D flip effect
          perspective: 600, // Add perspective for the 3D effect
          marginRight: side === "left" ? -6 : 0, // Adjust margin for left side
        }}
      >
      {/* Back side (CardFaceDown) */}
      <MotiView
        style={{
          backfaceVisibility: 'hidden', // Hide the back when the card is flipped
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <CardFaceDown side={side} isDealing = {isDealing} />
      </MotiView>

      {/* Front side (CardFaceUp) */}
      <MotiView
        style={{
          backfaceVisibility: 'hidden', // Hide the front when the card is flipped
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: [{ rotateY: '180deg' }], // Flip the front face
        }}
      >
        <CardFaceUp
          side={side}
          suite={suite}
          value={value}
          gameIsOver={gameIsOver}
          bestHand={bestHand}
          card={card}
          shouldShowWin={shouldShowWin}
        />
      </MotiView>
    </MotiView>
      );
    } else if (!isCurrentPlayer && gameIsOver && showCards) {
      if (card) {
        const value = card.slice(0, -1).replace("T", "10");
        const suite = card.slice(-1);
      
        // Define the animation for the revealed card
        const revealCardAnimation = {
          from: {
            opacity: 0.8,
            scale: 1,
          },
          animate: {
            opacity: 1, // Full opacity when shown
            scale: 1.1, // Slightly enlarge
          },
          transition: {
            type: 'timing',
            duration: 800, // Duration in milliseconds
            easing: (t: number) => t * (2 - t), // Custom easing function for smooth animation
          },
        };
      
        let leftValue = "";
        let noRotation = false;

        // TODO: make this responsive
        if (showCards[0] && showCards[1]) {
          // When both cards are shown, give distinct left positions to each card
          if (index === 0) {
            leftValue = "0px"; // Left card position
          } else if (index === 1) {
            leftValue = "90px"; // Right card position
          }
          noRotation=true;
        } else if (showCards[0]) {
          leftValue = "33px";
          noRotation = true;
        } else if (showCards[1]) {
          leftValue = "33px";
          noRotation = true;
        }
      
        if (index === 0 && showCards[0]) {
          return (
            <MotiView {...revealCardAnimation} 
              style={{
              zIndex: 1000, // High z-index to stay on top of everything
              position: 'absolute', // Absolute positioning for movement
              opacity: 1, // Full opacity
              left: leftValue, // Assuming leftValue is defined and is a number or string with units
              // React Native does not support filter directly, but you can use shadow properties
              // shadowColor: 'rgba(255, 255, 255, 0.8)', // Shadow color
              // shadowOffset: { width: 0, height: 0 }, // Shadow offset
              // shadowOpacity: 1, // Full opacity for shadow
              // shadowRadius: 10, // Increase brightness and add glow effect
              // elevation: 5, // For Android shadow effect
            }}>
              <CardFaceUp
                side={side}
                suite={suite}
                value={value}
                gameIsOver={gameIsOver}
                bestHand={bestHand}
                card={card}
                shouldShowWin={shouldShowWin}
                noRotation={noRotation}
                
              />
            </MotiView>
          );
        } else if (index === 1 && showCards[1]) {
          return (
            <MotiView {...revealCardAnimation} 
              style={{
              zIndex: 1000, // High z-index to stay on top of everything
              position: 'absolute', // Absolute positioning for movement
              opacity: 1, // Full opacity
              left: leftValue, // Assuming leftValue is defined and is a number or string with units
              // React Native does not support filter directly, but you can use shadow properties
              // shadowColor: 'rgba(255, 255, 255, 0.8)', // Shadow color
              // shadowOffset: { width: 0, height: 0 }, // Shadow offset
              // shadowOpacity: 1, // Full opacity for shadow
              // shadowRadius: 20, // Increase brightness and add glow effect
              // elevation: 10, // For Android shadow effect
            }}>
              <CardFaceUp
                side={side}
                suite={suite}
                value={value}
                gameIsOver={gameIsOver}
                bestHand={bestHand}
                card={card}
                shouldShowWin={shouldShowWin}
                noRotation={noRotation}                
            />
            </MotiView>
          );
        } else {
          return null;
        }  
      } else {
        return null;
      }
    } else if (!isCurrentPlayer && !gameIsOver && !hasFolded) {
      return <CardFaceDown side={side} isDealing = {isDealing} />;
    } else if (
      card &&
      !isCurrentPlayer &&
      !hasFolded &&
      gameIsOver &&
      handDescription
    ) {
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
      return <CardFaceDown side={side} isDealing = {isDealing}/>;
    }
  };

  return <CardWrapper {...animationProps}>{renderCard()}</CardWrapper>;
};

export default Card;








// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { MotiView } from "moti";
// import { CardFaceUp } from './CardFaceIUp';
// import { CardFaceDown } from "./CardFaceDown";

// interface CardProps {
//   card: string | null; // Card data, null means face down
//   boardCard?: boolean | null;
//   side: "left" | "right" | "none"; // 'none' is for board cards
//   isCurrentPlayer: boolean; // isCurrentPlayer means the player playing currently
//   gameIsOver: boolean;
//   hasFolded: boolean;
//   handDescription?: string | null;
//   index: number;
//   isAnimating?: boolean;
//   startPos?: { x: number; y: number };
//   endPos?: { x: number; y: number };
//   duration?: number;
//   bestHand: string[] | null;
//   showCards?: boolean[] | null;
//   shouldShowWin?: boolean;
// }

// const Card: React.FC<CardProps> = ({
//   card,
//   side,
//   isCurrentPlayer,
//   gameIsOver,
//   hasFolded,
//   index,
//   handDescription,
//   bestHand,
//   showCards = [false, false],
//   isAnimating = false,
//   startPos,
//   endPos,
//   duration = 1,
//   shouldShowWin = false,
// }) => {
//   const opponentMustShowCards = !isCurrentPlayer && gameIsOver && !hasFolded && card && handDescription;

//   // Define the 3D flip animation variants
//   const flipAnimation = {
//     hidden: { rotateY: 0 }, // Initially, no rotation (CardFaceDown)
//     visible: {
//       rotateY: 180, // Flip to 180 degrees (CardFaceUp)
//       transition: {
//         delay: 1,
//         duration: 1, // Flip animation duration
//         type: "timing", // Smooth easing
//       },
//     },
//   };

//   const renderCard = () => {
//     if (card && (side === "none" || isCurrentPlayer)) {
//       const value = card.slice(0, -1).replace("T", "10");
//       const suite = card.slice(-1);
//       return (
//         <CardFaceUp
//           side={side}
//           suite={suite}
//           value={value}
//           gameIsOver={gameIsOver}
//           bestHand={bestHand}
//           card={card}
//           shouldShowWin={shouldShowWin}
//         />
//       );
//     } else if (opponentMustShowCards) {
//       const value = card.slice(0, -1).replace("T", "10");
//       const suite = card.slice(-1);
//       return (
//         // <MotiView
//         //   from={flipAnimation.hidden}
//         //   animate={flipAnimation.visible}
//         <View
//           style={styles.cardContainer}
//         >
//           {/* Back side (CardFaceDown) */}
//           {/* <MotiView  */}
//           <View
//           style={styles.cardSide}>
//             <CardFaceDown side={side} />
//           {/* </MotiView> */}
//           </View>

//           {/* Front side (CardFaceUp) */}
//           {/* <MotiView  */}
//           <View
//           style={[styles.cardSide, styles.frontSide]}>
//             <CardFaceUp
//               side={side}
//               suite={suite}
//               value={value}
//               gameIsOver={gameIsOver}
//               bestHand={bestHand}
//               card={card}
//               shouldShowWin={shouldShowWin}
//             />
//             </View>
//           {/* </MotiView> */}
//         {/* </MotiView> */}
//         </View>
//       );
//     } else if (!isCurrentPlayer && gameIsOver && showCards) {
//       if (card) {
//         const value = card.slice(0, -1).replace("T", "10");
//         const suite = card.slice(-1);

//         const revealCardAnimation = {
//           initial: { opacity: 0.8, scale: 1 },
//           animate: {
//             opacity: 1,
//             scale: 1.1,
//           },
//           transition: { duration: 0.8, type: "timing" },
//         };

//         let leftValue = "0px";
//         if (showCards[0] && showCards[1]) {
//           leftValue = index === 0 ? "0px" : "90px";
//         } else if (showCards[0] || showCards[1]) {
//           leftValue = "33px";
//         }

//         const cardStyle = {
//           zIndex: 1000,
//           position: "absolute",
//           opacity: 1,
//           left: leftValue,
//         } as React.CSSProperties;

//         return (
//           // <MotiView {...revealCardAnimation} 
//           <View
//           style={cardStyle}>
//             <CardFaceUp
//               side={side}
//               suite={suite}
//               value={value}
//               gameIsOver={gameIsOver}
//               bestHand={bestHand}
//               card={card}
//               shouldShowWin={shouldShowWin}
//             />
//           {/* </MotiView> */}
//           </View>
//         );
//       }
//       return null;
//     } else if (!isCurrentPlayer && !gameIsOver && !hasFolded) {
//       return <CardFaceDown side={side} />;
//     } else if (card && !isCurrentPlayer && !hasFolded && gameIsOver && handDescription) {
//       const value = card.slice(0, -1).replace("T", "10");
//       const suite = card.slice(-1);
//       return (
//         <CardFaceUp
//           side={side}
//           suite={suite}
//           value={value}
//           gameIsOver={gameIsOver}
//           bestHand={bestHand}
//           card={card}
//           shouldShowWin={shouldShowWin}
//         />
//       );
//     } else {
//       return <CardFaceDown side={side} />;
//     }
//   };

//   return (
//     // <MotiView
//     //   from={isAnimating ? startPos : undefined}
//     //   animate={isAnimating ? endPos : undefined}
//     <View
//       style={styles.cardContainer}
//     >
//       {renderCard()}
//     {/* </MotiView> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cardContainer: {
//     position: 'relative',
//     height: 60,
//     width: 45,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardSide: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backfaceVisibility: 'hidden', // Hide the back when the card is flipped
//   },
//   frontSide: {
//     transform: [{ rotateY: '180deg' }], // Flip the front face
//   },
// });

// export default Card;
