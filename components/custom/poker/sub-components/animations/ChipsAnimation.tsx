import React, { useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import type { GameState, Player as PlayerType } from "@/types/poker"; // Adjust import paths as needed
import { generatePlayerPositions, getBettingAndDealerPositions, ScreenSize } from "@/lib/poker";

const ChipsAnimation = ({ 
   gameState,
   playerCount,
   screenSize,
   player,
   index,
   currentPlayerPosition,
}: {
  gameState: GameState,
  playerCount: number,
  screenSize: ScreenSize,
  player: PlayerType,
  index: number,
  currentPlayerPosition: number
}) => {
   const [animationPlayed, setAnimationPlayed] = useState(false);
   const playerPositions = generatePlayerPositions(screenSize);
   const bettingAndDealerPositions = getBettingAndDealerPositions(screenSize);
   // console.log("ChipsAnimation", screenSize, player)
   const onAnimationEnd = () => {
      setAnimationPlayed(true);
   }
   const handleAnimationEnd = () => {
      return null;
   }
   const showAnimation = gameState.gameIsAllIn !== "river" || 
      (gameState.communityCards.length === 5 && gameState?.netWinners.length) || 
      (player.previousBet > 0 && player.bet === 0 && !player.hasActed && !gameState?.netWinners.length);

   const renderPlayerChips = (player:any, index:number) => {
      const betValue = player.previousBet / 10;
      const purpleChipsCount = Math.floor(betValue / 50);
      const blackChipsCount = Math.floor((betValue % 50) / 15);
      const blueChipsCount = Math.floor((betValue % 15) / 5);
      const yellowChipsCount = Math.floor((betValue % 5) / 2);
      const redChipsCount = Math.floor((betValue % 2) / 0.5);

      const potChipsDistribution = [
         {chipsCount: 1, chipsType: require('@/assets/game/coin-red.png'), chipName: "coinred", zIndex: 10, chipIndex: 1 },
         {chipsCount: 1, chipsType: require('@/assets/game/coin-red.png'), chipName: "coinred", zIndex: 10, chipIndex: 2 },
         {chipsCount: 1, chipsType: require('@/assets/game/coin-red.png'), chipName: "coinred", zIndex: 10, chipIndex: 3 }
      ]

      const chipsDistribution = [
         { chipsCount: redChipsCount, chipsType: require('@/assets/game/coin-red.png'), chipName: "coinred", zIndex: 10 },
         { chipsCount: yellowChipsCount, chipsType: require('@/assets/game/coin-yellow.png'), chipName: "coinyellow", zIndex: 20 },
         { chipsCount: blueChipsCount, chipsType: require('@/assets/game/coin-blue.png'), chipName: "coinblue", zIndex: 30 },
         { chipsCount: blackChipsCount, chipsType: require('@/assets/game/coin-black.png'), chipName: "coinblack", zIndex: 40 },
         { chipsCount: purpleChipsCount, chipsType: require('@/assets/game/coin-purpule.png'), chipName: "coinpurple", zIndex: 50 },
      ];

      const rotatedPosition = (index + gameState.players.length - currentPlayerPosition) % gameState.players.length;
      const totalPlayerCount = Math.min(gameState.playerCount + gameState.waitingPlayers.length, 9);
      
      const leftPosition = playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.leftPosition;
      const topPosition = playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.topPosition;

      return (
         <AnimatePresence>
            {chipsDistribution.map((chip, chipIndex) => (
               <MotiView
                  key={`${player.id}-${chip.chipName}-${chipIndex}`}
                  style={{
                     position: "absolute",
                     left: leftPosition,
                     top: topPosition,
                     opacity: 1,
                  }}
                  animate={{
                     left: "48%",
                     top: "51%",
                     opacity: [1, 0],
                  }}
                  transition={{
                     duration: 0.5,
                     delay: 0.1 * chipIndex,
                  }}
               >
                  <View style={styles.pot}>
                     {renderChips(chip.chipsCount, chip.chipsType, chip.chipName, chip.zIndex)}
                  </View>
               </MotiView>
            ))}
         </AnimatePresence>
      );
   };

   const renderChips = (count: number, image: any, alt: string, zIndexBase: number) => {
      const chipsPerStack = 4;
      const stacks = Math.ceil(count / chipsPerStack);
      return (
         <View style={styles.chipContainer}>
            {Array.from({ length: stacks }).map((_, stackIndex) => (
               <View key={`${alt}-stack-${stackIndex}`} style={styles.chipStack}>
                  {Array.from({
                     length: Math.min(chipsPerStack, count - stackIndex * chipsPerStack),
                  }).map((_, chipIndex) => (
                     <Image
                        key={`${alt}-${stackIndex}-${chipIndex}`}
                        source={image}
                        style={{
                           width: 20,
                           height: 20,
                           marginTop: -5,
                           zIndex: zIndexBase - stackIndex * chipsPerStack - chipIndex,
                        }}
                     />
                  ))}
               </View>
            ))}
         </View>
      );
   };

   return (
      <AnimatePresence>
         {showAnimation ? renderPlayerChips(player, index) : null}
      </AnimatePresence>
   );
};

const styles = StyleSheet.create({
   pot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
   },
   chipContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
   },
   chipStack: {
      marginRight: 2,
      flexDirection: "column",
      justifyContent: "flex-end",
   },
});

export default ChipsAnimation;
