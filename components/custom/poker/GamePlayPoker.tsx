import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet } from 'react-native';
import type { GameState } from "@/types/poker";
import CardDealer from "./sub-components/animations/CardDealer";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import {
    calculateDelay,
    calculateDuration,
    getScreenSize,
    ScreenSize,
} from '@/lib/poker'
import Player from "./Player";
import { useSpan } from "@/utils/logging";
import { getAggregateBestHand } from "@/utils/handHelper";
import BettingControls from './BettingControls';
import InformationBanner from "./sub-components/navbar-area/InformationBanner";
import PokerChat from "./sub-components/social/PokerChat";
import TimeBankAnimation from "./sub-components/player-area/TimeBankAnimation";
import WaitingPlayers from "./WaitingPlayers";
import CurrentBestHand from "./sub-components/player-area/CurrentBestHand";
import BoardArea from "./sub-components/board-area/BoardArea";
import BuyBackInPopup from "../dialog/BuyBackInPopup";
import BombPotDecision from "./sub-components/BombPotDecision";
import Dimensions from 'react-native';
// 
const { width, height } = Dimensions.get('window');
interface Dimensions {
  height: number;
  width: number;
  marginBottom: number;
  marginLeft: number;
}

const desktopDimensions: Dimensions = {
  width: width * 0.65 * 2.225,
  height: height  * 0.65,
  marginBottom: 100,
  marginLeft: 0,
};

const ipadDimensions: Dimensions = {
  width: width,
  height: width*0.48,
  marginBottom: 100,
  marginLeft: 0,
};

const smallIphoneDimensions: Dimensions = {
  width: width * 0.67,
  height: height  * 0.67,
  marginBottom: 0,
  marginLeft: 0,
};

interface GameplayPokerMainProps {
  gameId: string;
  playerId: string;
  gameState: GameState | undefined;
  currentPlayerId: string | null;
  isSpectator: boolean;
  isSittingOut: boolean;
  allBoardCardsRevealed: boolean;
  showDealingAnimation: boolean;
  setAllBoardCardsRevealed: (value: boolean) => void;
  setIsSittingOut: (value: boolean) => void;
  isSittingOutNextHand: boolean;
  setIsSittingOutNextHand: (value: boolean) => void;
  setShowDealingAnimation: (value: boolean) => void;
  activeEmotes: Record<string, string | null>;
  isEmoteVisible: Record<string, boolean>;
  showEmoteButtonSelector: boolean;
  isEmoteSelectorVisible: boolean;
  setIsEmoteSelectorVisible: (value: boolean) => void;
  showTimeBankAnimation: boolean;
  setShowTimeBankAnimation: (value: boolean) => void;
  displayBB: boolean;
  setDisplayBB: (value: boolean) => void;
  playSoundEnabled: boolean;
  previousCommunityCards: string[];
  setPreviousCommunityCards: (value: string[]) => void;
  shouldShowWin: boolean;
  setShouldShowWin: (value: boolean) => void;
  showBombPotDecisionModal: boolean;
  setShowBombPotDecisionModal: (value: boolean) => void;
}
const GameplayPokerMain = ({
  gameId,
  playerId,
  gameState,
  currentPlayerId,
  isSpectator,
  isSittingOut,
  isSittingOutNextHand,
  allBoardCardsRevealed,
  showDealingAnimation,
  setAllBoardCardsRevealed,
  setIsSittingOut,
  setIsSittingOutNextHand,
  setShowDealingAnimation,
  activeEmotes,
  isEmoteVisible,
  showEmoteButtonSelector,
  isEmoteSelectorVisible,
  setIsEmoteSelectorVisible,
  showTimeBankAnimation,
  setShowTimeBankAnimation,
  displayBB, 
  setDisplayBB,
  playSoundEnabled,
  previousCommunityCards,
  setPreviousCommunityCards,
  shouldShowWin,
  setShouldShowWin,
  showBombPotDecisionModal,
  setShowBombPotDecisionModal
}: GameplayPokerMainProps) => {
  const span = useSpan("GameplayPokerMain");
  const user = useAuth();
  // console.log("GamePlayStateData--->",gameId,
  //   "playerId",playerId,
  //   "gameState",gameState,
  //   "currentPlayerId",currentPlayerId,
  //   "isSpectator",isSpectator,
  //   "isSittingOut",isSittingOut,
  //   "isSittingOutNextHand",isSittingOutNextHand,
  //   "allBoardCardsRevealed",allBoardCardsRevealed,
  //   "showDealingAnimation",showDealingAnimation,
  //   "activeEmotes",activeEmotes,
  //   "isEmoteVisible",isEmoteVisible,
  //   "showEmoteButtonSelector",showEmoteButtonSelector,
  //   "isEmoteSelectorVisible",isEmoteSelectorVisible,
  //   "showTimeBankAnimation",showTimeBankAnimation,
  //   "displayBB",displayBB, 
  //   "playSoundEnabled",playSoundEnabled,
  //   "previousCommunityCards",previousCommunityCards,
  //   "shouldShowWin",shouldShowWin,
  //   "showBombPotDecisionModal",showBombPotDecisionModal,)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const displayBBParam = queryParams.get("displayBB");

      if (displayBBParam === "true") {
        setDisplayBB(true);
      } else {
        // Explicitly set displayBB to false and update the URL
        setDisplayBB(false);
        queryParams.set("displayBB", "false");
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
        window.history.replaceState(null, "", newUrl);
      }
    } else {
      setDisplayBB(false); // Fallback
    }
  }, []);

  const currentPlayer = gameState?.players.find(
    (player) => player.id === playerId,
  );
  const currentPlayerPosition = currentPlayer?.position ?? 0;
  const thisPlayer = gameState?.players.find(
    (player) => player.id === playerId,
  );

  const isPlayerInGame = gameState?.players.some(
    (player) => player.id === playerId,
  );
  const isPlayerWaitingInGame = gameState?.waitingPlayers.some(
    (player) => player[2] === playerId,
  );

  //eslint-disable-next-line
  const [raiseAmount, setRaiseAmount] = useState(
    Math.min(
      //@ts-expect-error - minRaiseAmount can be undefined
      gameState?.minRaiseAmount,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      currentPlayer?.chips! + currentPlayer?.bet!,
    ),
  );
  //eslint-disable-next-line
  const [foldToAny, setFoldToAny] = useState(thisPlayer?.foldToAny!);
  // eslint-disable-next-line
  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);
  const [tableImage, setTableImage] = useState<any>(
    require('@/assets/game/table-small-iphone.png')
  );
  const [screenSize, setScreenSize] = useState<ScreenSize>("smallIphone");
  const [dimensions, setDimensions] = useState<Dimensions>(smallIphoneDimensions);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  const gameIsOver = gameState?.gameStage === "gameOver";
  const showBuyBackInPopUp =
    (thisPlayer?.chips ?? 0) === 0 &&
    thisPlayer?.boughtChips === 0 &&
    (thisPlayer?.sittingOut ||
      gameIsOver ||
      gameState?.gameStage === "preDealing");

  const [inactivityCount, setInactivityCount] = useState(0);
  const [currentBestHand, setCurrentBestHand] = useState<string>();

  // eslint-disable-next-line
  const isAllInBeforeRiver = gameState?.gameIsAllIn !== "river";
  // Determine how many new cards were revealed
  const newCardsCount =
    gameState?.communityCards?.length! - previousCommunityCards.length;

  let aggregateBestHand = null;
  if (gameState && gameState.netWinners.length > 0) {
    aggregateBestHand = getAggregateBestHand(gameState);
  }

  const showAnimation = (gameState && previousCommunityCards.length < gameState.communityCards.length) ?? false;

  // Animation variants for normal and dramatic (all-in) cases
  const cardVariants = {
    hidden: { opacity: showAnimation ? 0 : 1, y: showAnimation ? -30 : 0 }, // Cards start above with opacity 0
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: calculateDelay(
          i,
          newCardsCount,
          previousCommunityCards.length,
          isAllInBeforeRiver,
          gameState!
        ), // Dynamically calculate delay based on cards count
        duration: calculateDuration(i, newCardsCount, isAllInBeforeRiver), // Dynamically calculate duration based on cards count
      },
    }),
  };

  useEffect(() => {
    if (newCardsCount > 0) {
      // Only update if there are new cards (i.e., communityCards has increased in length)
      setPreviousCommunityCards(gameState?.communityCards!);
      setAllBoardCardsRevealed(false); // Reset to false until the animation completes
    }
  }, [
    gameState?.communityCards,
    gameState?.isBeginningOfTheHand,
    gameState?.gameStage,
  ]);


  // Update the raiseAmount everytime there is a new stage
  useEffect(() => {
    //eslint-disable-next-line
    setRaiseAmount(
      Math.min(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        gameState?.minRaiseAmount!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        currentPlayer?.chips! + currentPlayer?.bet!,
      ),
    );
  }, [gameState?.gameStage]);

  // only update if it is bigger than the current raiseAmount
  useEffect(() => {
    //eslint-disable-next-line
    const newMinRaiseAmount = gameState?.minRaiseAmount || 0;
    if (raiseAmount && newMinRaiseAmount > raiseAmount) {
      //eslint-disable-next-line
      setRaiseAmount(
        Math.min(
          newMinRaiseAmount,
          currentPlayer?.chips! + currentPlayer?.bet!,
        ),
      );
    }
  }, [gameState?.minRaiseAmount]);

  // Trigger the buy back in popup 6 seconds after all cards are revealed
  useEffect(() => {
    if (gameIsOver && allBoardCardsRevealed && showBuyBackInPopUp) {
      const timer = setTimeout(() => {
        setShouldShowPopup(true);
      }, 6000); // 6-second delay

      return () => clearTimeout(timer); // Clear the timer if component unmounts or state changes
    } else if (!gameIsOver && showBuyBackInPopUp) {
      // Immediately show the popup if the game is not over or the cards have not been revealed yet
      setShouldShowPopup(true);
    } else {
      setShouldShowPopup(false); // Reset popup state if conditions are not met
    }
  }, [gameIsOver, allBoardCardsRevealed, showBuyBackInPopUp]);

  useEffect(() => {
    const updateTableImage = () => {
      const screenSize = getScreenSize();
      setScreenSize(screenSize);
      console.log('GetSreenSize', screenSize)
          setTableImage(require('@/assets/game/table-small-iphone.png'));
          setDimensions(smallIphoneDimensions);
      // switch (screenSize) {
      //   case "smallIphone":
      //     setTableImage(require('@/assets/game/table-small-iphone.png'));
      //     setDimensions(smallIphoneDimensions);
      //     break;
      //   case "ipad":
      //     setTableImage(require('@/assets/game/table-ipad.png'));
      //     setDimensions(ipadDimensions);
      //     break;
      //   case "desktop":
      //     setTableImage(require('@/assets/game/table-desktop.png'));
      //     setDimensions(desktopDimensions);
      //     break;
      //   case "largeDesktop":
      //     setTableImage(require('@/assets/game/board-bg.png'));
      //     break;
      // }
    };

    updateTableImage(); // Set the initial table image
    window.addEventListener("resize", updateTableImage); // Update on window resize

    return () => window.removeEventListener("resize", updateTableImage);
  }, []);
  const height = dimensions.height; // Convert to number
  const width = dimensions.width;   // Convert to number
  console.log(height, width, "Dimention Height, width", dimensions)
  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        {/* {gameState && screenSize !== "smallIphone" && (
          <PokerChat gameState={gameState} screenSize={screenSize} />
        )} */}
        <InformationBanner
          isSittingOut={isSittingOut}
          isSittingOutNextHand={isSittingOutNextHand}
          inactivityCount={inactivityCount}
          currentPlayer={currentPlayer!}
          isSpectator={isSpectator}
          screenSize={screenSize}
        />
        {showTimeBankAnimation && (
          <TimeBankAnimation setShowTimeBankAnimation={setShowTimeBankAnimation} />
        )}
        {gameState?.isBombPotProposed && gameState?.gameStage === "gameOver" && (
          <BombPotDecision
            isBombPotProposed={gameState.isBombPotProposed}
            gameIsAllIn={gameState.gameIsAllIn}
            gameOverTimeStamp={gameState.gameOverTimeStamp!}
            thisPlayerBombPotDecision={thisPlayer?.bombPotDecision ?? "optOut"}
            proposer={gameState.bombPotSettings?.initiatorUsername}
            bigBlinds={gameState.bombPotSettings?.numberOfBigBlinds ?? 0}
            postFlopBetting={gameState.bombPotSettings?.postFlopBetting ?? false}
            gameId={gameState.gameId}
            gameState={gameState}
            showBombPotDecisionModal={showBombPotDecisionModal}
            setShowBombPotDecisionModal={setShowBombPotDecisionModal}
          />
        )}
        <View style={[styles.tableContainer, { height, width }]}>
          <Image source={tableImage} style={styles.tableImage} />
          {/* Player */}
          {gameState?.players.map((player, index) => (
            <Player
              key={player.id}
              player={{
                ...player,
                bet: player.bet / 100,
                totalHands: player.totalHands / 100 || 0,
                chips: player.chips / 100,
                potContribution: player.potContribution / 100,
              }}
              thisPlayer={thisPlayer!}
              currentPlayerId={currentPlayerId}
              gameState={gameState}
              playerId={playerId}
              allBoardCardsRevealed={allBoardCardsRevealed}
              setActionButtonsDisabled={setActionButtonsDisabled}
              setInactivityCount={setInactivityCount}
              setIsSittingOut={setIsSittingOut}
              setIsSittingOutNextHand={setIsSittingOutNextHand}
              index={index}
              shouldShowWin={shouldShowWin}
              setShouldShowWin={setShouldShowWin}
              currentPlayerPosition={currentPlayerPosition}
              setCurrentBestHand={setCurrentBestHand}
              activeEmote={activeEmotes[player.uuid] ?? null}
              isEmoteVisible={isEmoteVisible[player.uuid] ?? false}
              showEmoteButtonSelector={showEmoteButtonSelector}
              isEmoteSelectorVisible={isEmoteSelectorVisible}
              setIsEmoteSelectorVisible={setIsEmoteSelectorVisible}
              screenSize={screenSize}
              setScreenSize={setScreenSize}
              displayBB={displayBB}
              initialBigBlind={gameState.initialBigBlind}
              playSoundEnabled={playSoundEnabled}
              showBombPotDecisionModal={showBombPotDecisionModal}
            />
          ))}
          {/* WaitingPlayers */}
          <WaitingPlayers
            waitingPlayers={gameState?.waitingPlayers ?? []}
            playerId={playerId}
            playerCount={gameState?.playerCount ?? 0}
            screenSize={screenSize}
          />
          <CardDealer
            players={gameState?.players ?? []}
            playerCount={gameState?.playerCount ?? 0}
            currentPlayerPosition={currentPlayerPosition}
            gameState={gameState!}
            showDealingAnimation={showDealingAnimation}
            setShowDealingAnimation={setShowDealingAnimation}
            screenSize={screenSize}
          />
          {/* Board Cards */}
          {gameState && (
            <BoardArea
              gameState={gameState}
              aggregateBestHand={aggregateBestHand}
              setAllBoardCardsRevealed={setAllBoardCardsRevealed}
              previousCommunityCards={previousCommunityCards}
              shouldShowWin={shouldShowWin}
              cardVariants={cardVariants}
              screenSize={screenSize}
              displayBB={displayBB}
              initialBigBlind={gameState.initialBigBlind ?? 1}
            />
          )}
          {/* Betting Controls */}
          {gameState && currentPlayer && currentPlayerId && (
            <BettingControls
              gameId={gameId}
              gameState={gameState}
              currentPlayer={currentPlayer}
              currentPlayerId={currentPlayerId}
              playerId={playerId}
              user={user}
              setInactivityCount={setInactivityCount}
              actionButtonsDisabled={actionButtonsDisabled}
              setActionButtonsDisabled={setActionButtonsDisabled}
              raiseAmount={raiseAmount}
              setRaiseAmount={setRaiseAmount}
              foldToAny={foldToAny}
              setFoldToAny={setFoldToAny}
              screenSize={screenSize}
              displayBB={displayBB}
              initialBigBlind={gameState.initialBigBlind}
            />
          )}
          {screenSize !== "smallIphone" && (
            <CurrentBestHand
              currentBestHand={currentBestHand ?? ""}
              gameStage={gameState?.gameStage ?? ""}
              shouldShowWin={shouldShowWin}
            />
          )}
          {/* Buy Back In Popup */}
          {/* <BuyBackInPopup
            isOpen={shouldShowPopup}
            gameId={gameId}
            playerId={playerId}
            playerBalance={user.chips}
          /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundContainer: {
    flex: 1,
    minHeight: '100%', // Adjust as needed
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#fff', // Fallback color
    backgroundImage: require('@/assets/game/board-bg.png'), // Not applicable in React Native
    backgroundSize: 'cover', // Not applicable in React Native
  },
  tableContainer: {
    position: 'absolute',
    maxHeight: 750,
    maxWidth: 1700,
    width: '100%',
  },
  tableImage: {
    marginTop: 20,
    width: '100%', // Adjust according to your design
    height: '100%', // Maintain aspect ratio
    resizeMode: 'stretch'
  },
});

export default GameplayPokerMain;

