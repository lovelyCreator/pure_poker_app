// import React from "react";
// import { View, Text, StyleSheet, Image, Animated } from "react-native";
// import { getBettingAndDealerPositions, ScreenSize } from "@/lib/poker";
// import type { GameState, Player as PlayerType } from "@/types/poker";
// import Pot from "../board-area/Pot";
// import coinRed from "@/assets/game/coin-red.svg";
// import type { StaticImport } from "next/dist/shared/lib/get-img-props";

// const typedCoinRed= require('@/assets/game/coin-red.png');

// interface PlayerBetProps {
//   player: PlayerType;
//   gameState: GameState;
//   rotatedPosition: number;
//   screenSize: ScreenSize;
//   displayBB: boolean;
//   initialBigBlind: number;
//   currentPlayerPosition: number;
//   index: number;
//   shouldShowWin?: boolean;
//   style?: React.CSSProperties;
// }

// const PlayerBet: React.FC<PlayerBetProps> = ({
//   player,
//   gameState,
//   rotatedPosition,
//   screenSize,
//   initialBigBlind,
//   displayBB,
//   currentPlayerPosition,
//   index,
//   style,
//   shouldShowWin = false,
// }) => {
//   if (!(player.bet > 0 && gameState.gameInProgress)) return null;

//   const bettingAndDealerPositions = getBettingAndDealerPositions(screenSize);
//   const { left, top } =
//     bettingAndDealerPositions[gameState.players.length - 1]?.[rotatedPosition]
//       ?.betPosition || {};

//   const formatValue = (): string => {
//     if (displayBB) {
//       const amountInBB = player.bet / initialBigBlind;
//       const formattedBB = parseFloat((amountInBB * 100).toFixed(2));
//       return `${formattedBB} BB`;
//     } else {
//       const formattedChips = new Intl.NumberFormat("en-US").format(player.bet);
//       return formattedChips;
//     }
//   };

//   const raiseBetChips = [
//     { chipsCount: 1, chipsType: typedCoinRed, chipName: "coinred", zIndex: 10, chipIndex: 1 },
//     // { chipsCount: 1, chipsType: typedCoinRed, chipName: "coinred", zIndex: 10, chipIndex: 2 },
//     // { chipsCount: 1, chipsType: typedCoinRed, chipName: "coinred", zIndex: 10, chipIndex: 3 },
//   ];

//   const renderChips = (
//     count: number,
//     image: StaticImport,
//     alt: string,
//     zIndexBase: number,
//   ) => {
//     const chipsPerStack = 4;
//     const stacks = Math.ceil(count / chipsPerStack);

//     return (
//       <View style={styles.chipContainer}>
//         {Array.from({ length: stacks }).map((_, stackIndex) => (
//           <View key={`${alt}-stack-${stackIndex}`} style={styles.chipStack}>
//             {Array.from({
//               length: Math.min(chipsPerStack, count - stackIndex * chipsPerStack),
//             }).map((_, chipIndex) => (
//               <Image
//                 key={`${alt}-${stackIndex}-${chipIndex}`}
//                 source={image}
//                 style={{
//                   width: 20,
//                   height: 20,
//                   marginTop: -15,
//                   zIndex: zIndexBase - stackIndex * chipsPerStack - chipIndex,
//                 }}
//               />
//             ))}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         style,
//         { left, top, opacity: gameState?.isBeginningOfTheHand ? 0 : 1 },
//       ]}
//     >
//       {player.bet &&
//         gameState?.lastMove?.playerWhoMadeTheLastMove === player.uuid &&
//         (gameState?.lastMove?.lastMovePerformed === "RAISE" ||
//           gameState?.lastMove?.lastMovePerformed === "BET") && (
//           <View style={styles.chipAnimationContainer}>
//             {raiseBetChips.map((chip) => (
//               <Animated.View
//                 key={`playerbetchips${chip.chipIndex}fromplayer`}
//                 style={{
//                   position: "absolute",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   left: `${left}px`,
//                   top: `${top}px`,
//                   opacity: 1,
//                 }}
//               >
//                 {renderChips(chip.chipsCount, chip.chipsType, chip.chipName, chip.zIndex)}
//               </Animated.View>
//             ))}
//           </View>
//         )}
//       <View style={[styles.betInfoContainer, { left, top: 30 }]}>
//         <Pot
//           amountShown={player.bet}
//           amountInBigBlinds={(player.bet * 100) / gameState.initialBigBlind}
//           isMovingToPot={1}
//           screenSize={screenSize}
//           initialBigBlinds={initialBigBlind}
//           displayBB={displayBB}
//           gameState={gameState}
//           currentPlayerPosition={currentPlayerPosition}
//           index={index}
//           shouldShowWin={shouldShowWin}
//         />
//         <Text style={styles.betAmount}>{formatValue()}</Text>
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//   },
//   chipContainer: {
//     flexDirection: "row",
//   },
//   chipStack: {
//     marginRight: 8,
//     flexDirection: "column",
//     justifyContent: "flex-end",
//   },
//   chipAnimationContainer: {
//     flex: 1,
//   },
//   betInfoContainer: {
//     position: "absolute",
//     zIndex: 20,
//     width: 80,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   betAmount: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//     marginTop: -5,
//   },
// });

// export default PlayerBet;



import React from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { getBettingAndDealerPositions, ScreenSize } from "@/lib/poker";
import type { GameState, Player as PlayerType } from "@/types/poker";
import Pot from "../board-area/Pot";
import { MotiView } from "moti";

const typedCoinRed= require('@/assets/game/coin-red.png');

interface PlayerBetProps {
  player: PlayerType;
  gameState: GameState;
  rotatedPosition: number;
  screenSize: ScreenSize;
  displayBB: boolean;
  initialBigBlind: number;
}

const PlayerBet: React.FC<PlayerBetProps> = ({
  player,
  gameState,
  rotatedPosition,
  screenSize,
  initialBigBlind,
  displayBB,
}) => {
  if (!(player.bet > 0 && gameState.gameInProgress)) return null;

  const bettingAndDealerPositions = getBettingAndDealerPositions(screenSize);
  const { left, top } =
    bettingAndDealerPositions[gameState.players.length - 1]?.[rotatedPosition]
      ?.betPosition || {};

  const formatValue = (): string => {
    if (displayBB) {
      const amountInBB = player.bet / initialBigBlind;
      const formattedBB = parseFloat((amountInBB * 100).toFixed(2));
      return `${formattedBB} BB`;
    } else {
      const formattedChips = new Intl.NumberFormat("en-US").format(player.bet);
      return formattedChips;
    }
  };

  return (
    <MotiView
      key={`-${gameState?.isBeginningOfTheHand}`}
      from={{ opacity: gameState?.isBeginningOfTheHand ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing',
          duration: 100,  // Duration in milliseconds
          delay: 180    
        }}
    >
      <View
        style={{ left: left+10, top: top+20, position: 'absolute', zIndex: 20, width: 20, }}
      >
        <View 
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 8, }}
        >
          <Text 
            style={{ width: 'auto', fontWeight: '600', color: 'white', left: -5, }}
          >
            {formatValue()}
          </Text>
          <View style={{flexShrink: 0,}}>
            <Pot
              amountShown={player.bet}
              amountInBigBlinds={(player.bet * 100) / gameState.initialBigBlind}
              isMovingToPot={1}
              screenSize={screenSize}
              initialBigBlinds={initialBigBlind}
              displayBB={displayBB} 
            />
          </View>
        </View>
      </View>
    </MotiView>
  )

};


export default PlayerBet;
