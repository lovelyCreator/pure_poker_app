import React, { useState } from "react";
import { View, Image, Text, StyleSheet, Easing } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import type { GameState, Player as PlayerType } from "@/types/poker"; // Adjust import paths as needed
import { generatePlayerPositions, getBettingAndDealerPositions, ScreenSize } from "@/lib/poker";

const ChipsAnimation = ({ 
   gameState,
   playerCount,
   screenSize,
   style,
   player,
   index,
   currentPlayerPosition,
   allBoardCardsRevealed
}: {
   gameState: GameState;
   playerCount: number;
   screenSize: ScreenSize;
   style?: React.CSSProperties;
   player: PlayerType;
   index: number;
   currentPlayerPosition: number;
   allBoardCardsRevealed: boolean;
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
   const showAnimation = gameState?.gameIsAllIn !== "river" || 
      (gameState?.communityCards.length === 5 && gameState?.netWinners.length) || 
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
         { chipsCount: redChipsCount, chipsType: require('@/assets/game/coin-red.png'), chipName: "coinred", zIndex: 10, chipIndex: 1 },
         { chipsCount: yellowChipsCount, chipsType: require('@/assets/game/coin-yellow.png'), chipName: "coinyellow", zIndex: 20, chipIndex: 2 },
         { chipsCount: blueChipsCount, chipsType: require('@/assets/game/coin-blue.png'), chipName: "coinblue", zIndex: 30, chipIndex: 3 },
         { chipsCount: blackChipsCount, chipsType: require('@/assets/game/coin-black.png'), chipName: "coinblack", zIndex: 40, chipIndex: 4 },
         { chipsCount: purpleChipsCount, chipsType: require('@/assets/game/coin-purpule.png'), chipName: "coinpurple", zIndex: 50, chipIndex: 5 },
      ];

      const rotatedPosition = (index + gameState.players.length - currentPlayerPosition) % gameState.players.length;
      const totalPlayerCount = Math.min(gameState.playerCount + gameState.waitingPlayers.length, 9);
      
      const leftPosition = playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.leftPosition;
      const topPosition = playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.topPosition;

      return (
         <AnimatePresence>
            {potChipsDistribution.map((chip) => (
            <MotiView
               style={{
                  height: 30,
                  position: 'absolute',
                  left: leftPosition,
                  top: topPosition,
                  transform: [
                     { translateX: -60 }, // Adjust based on screen size
                  ],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  opacity: 1,
                  ...style
               }}
               animate={{
                  left: "48%",
                  top: "65%",
                  translateX: 0,
                  translateY: 0,
                  opacity: [1, 1, 0], // Animation sequence
               }}
               transition={{
                  duration: 500, // Duration in milliseconds
                  type: 'timing',
                  easing: Easing.out(Easing.ease),
                  delay: 100 * chip.chipIndex, // Delay based on chip index
               }}
               key={`${player.id}-${chip.chipIndex}+${player.uuid}movingchips`}
            >
               <View style={styles.pot}>
                  {renderChips(chip.chipsCount, chip.chipsType, chip.chipName, chip.zIndex)}
               </View>
            </MotiView>
            ))}
            {chipsDistribution.map((chip) => (
            <MotiView
               style={{
                  height: 30,
                  position: 'absolute',
                  left: leftPosition,
                  top: topPosition,
                  transform: [
                     { translateX: screenSize === "smallIphone" ? -60 : -70 }, // Adjust based on screen size
                  ],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  opacity: 1,
                  ...style
               }}
               animate={{
                  left: "48%",
                  top: "65%",
                  translateX: 0,
                  translateY: 0,
                  opacity: [1, 1, 0], // Animation sequence
                  }}
                  transition={{
                  duration: 500, // Duration in milliseconds
                  type: 'timing',
                  easing: Easing.out(Easing.ease),
                  delay: 100 * chip.chipIndex, // Delay based on chip index
               }}
               key={`${player.id}-${chip.chipIndex}+${player.uuid}movingchips`}
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
                           marginTop: -15,
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
