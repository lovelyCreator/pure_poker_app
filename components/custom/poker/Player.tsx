import React, { useEffect, useState } from "react";
import type { GameState, Player as PlayerType } from "@/types/poker";
import { getAggregateBestHand } from "@/utils/handHelper";
import {
  concatBestHandDescription,
  evaluateBestHand,
} from "@/lib/evaluateBestHand";
import LastMoveIndicator from "./sub-components/player-area/LastMoveIndicator";
import Emote from "./sub-components/social/Emote";
import EmoteSelector from "./sub-components/social/EmoteSelector";
import TimeBank from "./sub-components/player-area/TimeBank";
import PlayerCards from "./sub-components/player-area/PlayerCards";
import PlayerDetails from "./sub-components/player-area/PlayerDetails";
import DealerButton from "./sub-components/player-area/DealerButton";
import PlayerBet from "./sub-components/player-area/PlayerBet";
import EmoteToggleButton from "./sub-components/social/EmoteToggleButton";
import { generatePlayerPositions, getScreenSize, ScreenSize } from "@/lib/poker";
import WinAnimation from "./sub-components/player-area/WinAnimation";
import CreateBombPot from "./sub-components/player-area/CreateBombPot";
import PlayerBombPotDecisionStatus from "./sub-components/player-area/PlayerBombPotDecisionStatus";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ChipsAnimation from "./sub-components/animations/ChipsAnimation";
import CreateOrJoinGame from "../dialog/CreateOrJoinGame";
import { useAuth } from "@/hooks/useAuth";

interface PlayerProps {
  player: PlayerType | null;
  thisPlayer: PlayerType;
  currentPlayerId: string | null;
  gameState: GameState;
  playerId: string;
  allBoardCardsRevealed: boolean;
  setActionButtonsDisabled: (disabled: boolean) => void;
  setInactivityCount: (count: number) => void;
  setIsSittingOut: (value: boolean) => void;
  setIsSittingOutNextHand: (value: boolean) => void;
  index: number;
  shouldShowWin: boolean;
  setShouldShowWin: (value: boolean) => void;
  currentPlayerPosition: number;
  setCurrentBestHand: (value: string) => void;
  activeEmote: string | null;
  isEmoteVisible: boolean;
  showEmoteButtonSelector: boolean;
  isEmoteSelectorVisible: boolean;
  setIsEmoteSelectorVisible: (value: boolean) => void;
  screenSize: ScreenSize;
  setScreenSize: (value: ScreenSize) => void;
  displayBB: boolean; // New prop
  initialBigBlind: number; // New prop
  playSoundEnabled: boolean;
  showBombPotDecisionModal: boolean;
}

const Player: React.FC<PlayerProps> = ({
  player,
  thisPlayer,
  currentPlayerId,
  gameState,
  playerId,
  allBoardCardsRevealed,
  // eslint-disable-next-line
  setActionButtonsDisabled,
  setInactivityCount,
  setIsSittingOut,
  setIsSittingOutNextHand,
  index,
  shouldShowWin,
  setShouldShowWin,
  currentPlayerPosition,
  setCurrentBestHand,
  activeEmote,
  isEmoteVisible,
  showEmoteButtonSelector,
  isEmoteSelectorVisible,
  setIsEmoteSelectorVisible,
  screenSize,
  setScreenSize,
  displayBB,
  initialBigBlind,
  playSoundEnabled,
  showBombPotDecisionModal,
}) => {


  const screenSizeBis = getScreenSize();
  const [playerPositions, setPlayerPositions] = useState(
    generatePlayerPositions(screenSizeBis),
  );

  const totalPlayerCount = gameState.maxPlayers;

  const rotatedPosition =
    (index + totalPlayerCount - currentPlayerPosition) %
    totalPlayerCount;
  
  const user = useAuth();
  const userIsVerified = user.clearApproval === "approved";

  const [timeBarWidth, setTimeBarWidth] = useState(100);
  // eslint-disable-next-line
  const [playerHand, setPlayerHand] = useState(player?.hand || []);
  const [prevGameStage, setPrevGameStage] = useState(gameState.gameStage);

  const gameIsOver = gameState.gameStage === "gameOver";

  const isLastMover = !!player &&
    gameState.lastMove?.playerWhoMadeTheLastMove === player.uuid;
  // eslint-disable-next-line
  const lastMove = gameState.lastMove?.lastMovePerformed!;

  const isCurrentTurn = !!player &&
    currentPlayerId === player.id && gameState.gameInProgress;
  const isCurrentPlayer = playerId === player?.id;
  const isWinner = gameState.netWinners.includes(player?.uuid ?? "");

  const currentPlayerTurn = gameState?.players[gameState.currentTurn];

  const dealerIndex = gameState.dealerIndex;

  let aggregateBestHand = null;
  if (gameState && gameState.netWinners.length > 0) {
    aggregateBestHand = getAggregateBestHand(gameState);
  }

  /**
   * Updates the time bar and action buttons based on gameState's startTurnTimeStamp.
   */
  useEffect(() => {
    const updateInterval = 16; // Update every 100ms for smoothness
    //eslint-disable-next-line
    let intervalId: NodeJS.Timeout;
    const currentPlayerTurn = gameState.players[gameState.currentTurn];
    const timeLimitGiven = gameState.waitTimeCheckFold - 0.5;
    const timeLimit = timeLimitGiven + (currentPlayerTurn?.extraTime ?? 0);

    const updateBar = () => {
      const startTimestamp = gameState.startTurnTimeStamp
        ? new Date(gameState.startTurnTimeStamp).getTime()
        : null;

      if (startTimestamp) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTimestamp) / 1000; // elapsed time in seconds

        // Calculate the percentage of time remaining
        const remainingPercentage = Math.max(
          0,
          ((timeLimit - elapsedTime) / timeLimit) * 100,
        );

        // Update the width of the time bar
        setTimeBarWidth(remainingPercentage);

        // Disable action buttons when time is up
        if (remainingPercentage === 0) {
          setActionButtonsDisabled(true);
          clearInterval(intervalId); // Stop further updates
        } else {
          setActionButtonsDisabled(false);
        }
      } else {
        // If startTurnTimeStamp is null, disable the time bar and action buttons
        setTimeBarWidth(0);
        setActionButtonsDisabled(true);
        clearInterval(intervalId); // Stop further updates
      }
    };

    // Start the interval
    intervalId = setInterval(updateBar, updateInterval);

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
      setActionButtonsDisabled(false);
    };
  }, [gameState.startTurnTimeStamp, gameState.players]);

  // Handle the delayed display of winning elements
  useEffect(() => {
    // eslint-disable-next-line
    const showDownIsHappening =  gameState.players.filter((p) => p && p.handDescription).length >= 2;

    if (
      gameIsOver &&
      (allBoardCardsRevealed || gameState.communityCards.length === 0)
    ) {
      if (showDownIsHappening) {
        // Standard case: Show win after 1 second
        const timer1 = setTimeout(() => {
          setShouldShowWin(true);
        }, 1000);

        return () => {
          clearTimeout(timer1);
        };
      } else {
        setShouldShowWin(true);
      }
    } else {
      setShouldShowWin(false);
    }
  }, [gameState.gameStage, allBoardCardsRevealed]);

  /**
   * Detects changes in game stage and handles actions such as resetting the player's bet.
   */
  useEffect(() => {
    if (!player) {
      return;
    }
    setPlayerHand(player.hand);
    if (gameState.gameStage !== prevGameStage) {
      setTimeout(() => {
        player.previousBet = 0;
      }, 2000);

      setPrevGameStage(gameState.gameStage);
    }
    if (isCurrentPlayer) {
      setInactivityCount(player.inactivityCount);
      setIsSittingOut(player.sittingOut);
      setIsSittingOutNextHand(player.sitOutNextHand);
    }
    //eslint-disable-next-line
    if (gameState.communityCards && gameState.communityCards.length && player.hand && player.hand.length && isCurrentPlayer) {
      const allCards = player.hand.concat(gameState.communityCards);
      //eslint-disable-next-line
      setCurrentBestHand(
        concatBestHandDescription(evaluateBestHand(...allCards).description),
      );
    } else if (!gameState.communityCards.length) {
      setCurrentBestHand("");
    }

    // Play currentTurnSound if it's the player's turn
    const isCurrentTurnBis = currentPlayerId === player.id && gameState.gameInProgress;
    if (isCurrentTurnBis && isCurrentPlayer && playSoundEnabled) {
      setTimeout(() => {
        const currentTurnAudio = new Audio("/sounds/currentTurnSound.mp3");
        currentTurnAudio.play().catch((error) => {
          console.error("Error playing currentTurnSound:", error);
        });
      }, 800); // Delay of 0.8 seconds
    }
  }, [gameState.gameStage, prevGameStage, gameState.currentTurn, gameState.gameOverTimeStamp]);

  // Function to change the emote
  const toggleEmoteSelector = () => {
    setIsEmoteSelectorVisible(!isEmoteSelectorVisible);
  };

  // If the player is `null`, render the `EmptySeat` view
  if (!player) {
    const isDisabled = !userIsVerified || gameState.players.some((p) => p?.username === user?.username);
    
  const leftPosition = playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.leftPosition;
  const topPosition = playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.topPosition;
    return (
    //   <div
    //     className="z-30 absolute flex items-center justify-center text-gray-500"
    //     style={{
    //       left: `${playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.leftPosition}`,
    //       top: `${playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.topPosition}`,
    //       transform: "translate(-50%, -50%)",
    //     }}
    //   >
    //     <CreateOrJoinGame
    //         userIsVerified={userIsVerified}
    //         isCreateGame={false}
    //         defaultGameId={gameState.gameId}
    //         seatPosition={index}
    //       >
    //         <button
    //           className={`w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[90px] lg:h-[90px] xl:w-[100px] xl:h-[100px] rounded-full flex items-center justify-center font-bold text-lg transition-all shadow-md ${
    //             isDisabled
    //               ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
    //               : "bg-gray-500 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer opacity-100"
    //           }`}
    //           disabled={isDisabled}
    //         >
    //           <span
    //             className="relative block w-[28px] h-[28px] md:w-[37px] md:h-[37px] lg:w-[45px] lg:h-[45px] xl:w-[52px] xl:h-[52px] before:absolute before:content-[''] before:w-full before:h-[6px] before:bg-current before:rounded-full before:top-1/2 before:left-0 before:transform before:-translate-y-1/2
    //                         after:absolute after:content-[''] after:w-[6px] after:h-full after:bg-current after:rounded-full after:left-1/2 after:top-0 after:transform after:-translate-x-1/2"
    //           />
    //         </button>
    //       </CreateOrJoinGame>
    //   </div>
    
    <View style={{ left: leftPosition, top: topPosition, 
      position: 'absolute',
      zIndex: 30,
      alignItems: 'center',
      justifyContent: 'center', }}>
      <CreateOrJoinGame
        userIsVerified={userIsVerified}
        isCreateGame={false}
        defaultGameId={gameState.gameId}
        seatPosition={index}
      >
        <View
          style={[
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              
              left: -20,
              top: 20
            },
            isDisabled ? 
            {          
              backgroundColor: '#A0AEC0', // bg-gray-400
              color: '#A0AEC0', // text-gray-600
              opacity: 0.5,
            } : 
            {
              backgroundColor: '#A0AEC0', // bg-gray-500
              color: '#4A5568', // text-gray-800
            }
          ]}
          // disabled={isDisabled}
        >
          <View style={{
            width: 28,
            height: 28,
            position: 'relative',
            borderRadius: 14,
          }} >
            <View style={{
              position: 'absolute',
              width: '100%',
              height: 6,
              left: 0,
              backgroundColor: 'currentColor',
              top: 8,
              borderRadius: 6,
              transform: [{translateY: '50%'}]
            }}/>
            <View style={{
              position: 'absolute',
              width: 6,
              height: '100%',
              left: 8,
              backgroundColor: 'currentColor',
              top: 0,
              borderRadius: 6,
              transform: [{translateX: '50%'}]
            }}/>
          </View>
        </View>
      </CreateOrJoinGame>
    </View>
    );
  }
  return (
    <View 
      style={{
        width: '100%', 
        position: 'absolute', 
        inset: 0,
      }}
    >
      {/* Chips Animation */}
      {/* <ChipsAnimation
        gameState={gameState ?? ({} as GameState)}
        playerCount={gameState?.playerCount ?? 0}
        screenSize={screenSize}
        index={index}
        player={player}
        currentPlayerPosition={currentPlayerPosition}
        // allBoardCardsRevealed={allBoardCardsRevealed}
      /> */}
      <View
        style={{
          position: 'absolute', zIndex: 20,
          opacity: `${player?.inHand || gameIsOver ? 1 : 0.4}`,
          left: `${playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.leftPosition}`,
          top: `${playerPositions[totalPlayerCount - 1]?.[rotatedPosition]?.topPosition}`,
          transform: "translate(-50%, -50%)",
          // left: `${playerPositions[8]?.[0]?.leftPosition}`,
          // top: `${playerPositions[8]?.[0]?.topPosition}`,
        }}
        key={index}
      >
        {/* Display the Emote */}
        <Emote emote={activeEmote} isVisible={isEmoteVisible} />

        {/* Toggle button for emote selector */}
        {/* {showEmoteButtonSelector && isCurrentPlayer && (
          <EmoteToggleButton
            toggleEmoteSelector={toggleEmoteSelector}
            isEmoteSelectorVisible={isEmoteSelectorVisible}
          />
        )} */}

        {/* Emote Selector */}
        {/* {isEmoteSelectorVisible && isCurrentPlayer && (
          <EmoteSelector gameId={gameState.gameId} />
        )} */}

        {isCurrentTurn &&
          isCurrentPlayer &&
          currentPlayerTurn.extraTime === 0 &&
          screenSize !== "smallIphone" && (
            <TimeBank player={currentPlayerTurn} gameId={gameState.gameId} />
          )}
        
        {isCurrentPlayer && gameState.gameStarted && screenSize !== "smallIphone" &&
          <CreateBombPot 
            thisPlayer={thisPlayer} 
            gameId={gameState.gameId} 
            gameState={gameState}
          />
        }

        {showBombPotDecisionModal && 
          <PlayerBombPotDecisionStatus currentDecision={player.bombPotDecision} />
        }
  {/* <View
    style={{
      position: 'absolute',
    }}
  > */}
        <PlayerBet
          player={player}
          gameState={gameState}
          rotatedPosition={rotatedPosition}
          screenSize={screenSize}
          initialBigBlind={initialBigBlind}
          displayBB={displayBB}
        />
  {/* </View> */}

        <WinAnimation
          isVisible={shouldShowWin && isWinner && !player.handDescription} 
          playSoundEnabled={playSoundEnabled}
          amountWon={player.amountWon}
        />

        {!gameState.isBeginningOfTheHand && (
          <LastMoveIndicator
            key={`${gameState.startTurnTimeStamp} - ${gameState.isBeginningOfTheHand}`}
            isLastMover={isLastMover}
            lastMove={lastMove}
          />
        )}

        <PlayerDetails
          playerId={player.id}
          playerChips={player.chips}
          playerName={player.id}
          profilePicture={player.profilePicture}
          isCurrentPlayer={isCurrentPlayer}
          isCurrentTurn={isCurrentTurn}
          hasFolded={!player.inHand}
          gameIsOver={gameState.gameStage === "gameOver"}
          shouldShowWin={shouldShowWin}
          sittingOut={player.sittingOut}
          timeBarWidth={timeBarWidth}
          hasExtraTime={(currentPlayerTurn?.extraTime ?? 0) > 0}
          screenSize={screenSize}
          displayBB={displayBB} // Pass new prop
          initialBigBlind={initialBigBlind} // Pass new prop
          handsPlayed={player.handsPlayed}
          vpip={(player.handsPlayed / (player.totalHands + 0.000000001))}
        />

        <PlayerCards
          gameState={gameState}
          playerHand={playerHand}
          isCurrentPlayer={isCurrentPlayer}
          gameIsOver={gameIsOver}
          player={player}
          shouldShowWin={shouldShowWin}
          aggregateBestHand={aggregateBestHand}
          key={`${gameState?.gameStage}-${gameState?.startTurnTimeStamp}-${gameState?.gameOverTimeStamp}`}
        />

        <DealerButton
          gameState={gameState}
          index={index}
          dealerIndex={dealerIndex}
          rotatedPosition={rotatedPosition}
          screenSize={screenSize}
        />
      </View>
    </View>
  );
};

export default Player;
