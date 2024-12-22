import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Card from "../Card";
import { generatePlayerPositions, getScreenSize, ScreenSize } from "@/lib/poker";
import type { GameState, Player as PlayerType } from "@/types/poker";
import { MotiView, AnimatePresence } from "moti"; // Ensure you have Moti installed

interface CardDealerProps {
  players: PlayerType[];
  gameState: GameState;
  playerCount: number;
  currentPlayerPosition: number;
  showDealingAnimation: boolean;
  setShowDealingAnimation: (value: boolean) => void;
  screenSize: ScreenSize;
}

const CardDealer: React.FC<CardDealerProps> = ({
  players,
  gameState,
  playerCount,
  showDealingAnimation,
  currentPlayerPosition,
  setShowDealingAnimation,
  screenSize
}) => {
  const [shouldAnimateFirstCard, setShouldAnimateFirstCard] = useState<Record<number, boolean>>({});
  const [shouldAnimateSecondCard, setShouldAnimateSecondCard] = useState<Record<number, boolean>>({});
  const [playerPositions, setPlayerPositions] = useState(generatePlayerPositions('desktop'));

  const isNoBetBombPot = gameState && gameState.bombPotActive && !gameState.bombPotSettings.postFlopBetting;

  useEffect(() => {
    const handleResize = () => {
      const newScreenSize = getScreenSize();
      setPlayerPositions(generatePlayerPositions(newScreenSize));
    };

    const subscription = Dimensions.addEventListener("change", handleResize);
    handleResize(); // Call initially to set positions

    return () => {
      subscription?.remove();
    };
  }, []);

  // Trigger animation states for each player independently
  useEffect(() => {
    if (showDealingAnimation) {
      const firstCardTimers: NodeJS.Timeout[] = [];
      const secondCardTimers: NodeJS.Timeout[] = [];

      players.forEach((_, index) => {
        firstCardTimers.push(
          setTimeout(() => setShouldAnimateFirstCard((prev) => ({ ...prev, [index]: true })), index * 400)
        );
        secondCardTimers.push(
          setTimeout(() => setShouldAnimateSecondCard((prev) => ({ ...prev, [index]: true })), 
          index * 400 + 200)
        );
      });

      const resetFirstCardTimer = setTimeout(() => {
        setShouldAnimateFirstCard({});
      }, 1200);

      const resetSecondCardTimer = setTimeout(() => {
        setShouldAnimateSecondCard({});
      }, 1400);

      return () => {
        firstCardTimers.forEach(clearTimeout);
        secondCardTimers.forEach(clearTimeout);
        clearTimeout(resetFirstCardTimer);
        clearTimeout(resetSecondCardTimer);
        setShowDealingAnimation(false);
      };
    }
  }, [showDealingAnimation]);

  return (
    <AnimatePresence>
      {players?.slice(0, playerCount).map((player, index) => {
        const rotatedPosition =
          (index + playerCount - currentPlayerPosition) % playerCount;
        const playerPosition = playerPositions[playerCount - 1]?.[rotatedPosition];

        if (!player || player.sittingOut || !(gameState?.isBeginningOfTheHand || isNoBetBombPot) || (gameState?.bombPotActive && player.bombPotDecision !== "optIn")) {
          return null;
        }

        return (
          (gameState?.isBeginningOfTheHand || isNoBetBombPot) && (
            <View key={player && player.id} 
            style={{
              top: '30%'
            }}
            // style={styles.playerContainer}
            >
              {/* Map over both cards: left and right */}
              {[0, 1].map((cardIndex) => (
                <MotiView
                  key={`${player && player.id}-${cardIndex}`}
                  from={{
                    left: cardIndex === 0 ? "53%" : "56%", // Offset positions for the first and second cards
                    top: "33%",
                    opacity: 0,
                    scale: 1,
                    position: "absolute",
                    rotate: cardIndex === 0 ? "-7deg" : "5deg",
                  }}
                  animate={
                    cardIndex === 0
                      ? shouldAnimateFirstCard[index]
                        ? {
                            left: "45%",
                            top: "33%",
                            opacity: 1,
                            scale: 1,
                          }
                        : {
                            left: `${playerPosition?.leftPosition}`,
                            top: `${playerPosition?.topPosition}`,
                            opacity: 0,
                            scale: 1.0,
                            transform: 'translate(-125%, -50%)'
                          }
                      : shouldAnimateSecondCard[index]
                      ? {
                          left: "51%",
                          top: "33%",
                          opacity: 1,
                          scale: 1,
                        }
                      : {
                          left: `${playerPosition?.leftPosition}`,
                          top: `${playerPosition?.topPosition}`,
                          opacity: 0,
                          scale: 1.0,
                        }
                  }
                  transition={{
                    duration: 0.8,
                    stiffness: 30,
                    delay: cardIndex * 0.2,
                  }}
                  exit={{
                    scale: 1,
                    opacity: 0,
                  }}
                  style={{
                    top: '50%',
                  }}
                >
                  <Card
                    card={null}
                    bestHand={null}
                    side={cardIndex === 0 ? "left" : "right"}
                    isCurrentPlayer={false}
                    gameIsOver={false}
                    hasFolded={!player.inHand}
                    index={cardIndex}
                  />
                </MotiView>
              ))}
            </View>
          )
        );
      })}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  // playerContainer: {
  //   position: "relative",
  //   width: "100%",
  //   height: "100%",
  // },
});

export default CardDealer;
