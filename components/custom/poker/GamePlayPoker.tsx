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
import { Dimensions } from 'react-native';
import { Linking } from "react-native";
const { width, height } = Dimensions.get('window');
interface dimensions {
  height: number;
  width: number;
  marginBottom: number;
  marginLeft: number;
}

// const desktopdimensions: dimensions = {
//   width: width * 0.65 * 2.225,
//   height: height  * 0.65,
//   marginBottom: 100,
//   marginLeft: 0,
// };

// const ipaddimensions: dimensions = {
//   width: width,
//   height: width*0.48,
//   marginBottom: 100,
//   marginLeft: 0,
// };

const smallIphonedimensions: dimensions = {
  width: height * 0.67 * 0.654,
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

  useEffect(() => {
    const handleUrl = (url:string) => {
      const queryParams = new URLSearchParams(url.split("?")[1]);
      const displayBBParam = queryParams.get("displayBB");

      if (displayBBParam === "true") {
        setDisplayBB(true);
      } else {
        setDisplayBB(false);
      }
    };

    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleUrl(initialUrl);
      }
    };

    getInitialUrl();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  const currentPlayer = gameState?.players.find(
    (player) => player && player.id === playerId,
  );
  const currentPlayerPosition = currentPlayer?.position ?? 0;
  const thisPlayer = gameState?.players.find(
    (player) => player && player.id === playerId,
  );

  // const isPlayerInGame = gameState?.players.some(
  //   (player) => player.id === playerId,
  // );
  // const isPlayerWaitingInGame = gameState?.waitingPlayers.some(
  //   (player) => player[2] === playerId,
  // );

  // const currentPlayer = gameState?.players.find(
  //   (player) => player.id === playerId,
  // );
  // const currentPlayerPosition = currentPlayer?.position ?? 0;
  // const thisPlayer = gameState?.players.find(
  //   (player) => player.id === playerId,
  // );

  // const isPlayerInGame = gameState?.players.some(
  //   (player) => player.id === playerId,
  // );
  // const isPlayerWaitingInGame = gameState?.waitingPlayers.some(
  //   (player) => player[2] === playerId,
  // );

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
  const [dimensions, setdimensions] = useState<dimensions>(smallIphonedimensions);
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
          setdimensions(smallIphonedimensions);
      // switch (screenSize) {
      //   case "smallIphone":
      //     setTableImage(require('@/assets/game/table-small-iphone.png'));
      //     setdimensions(smallIphonedimensions);
      //     break;
      //   case "ipad":
      //     setTableImage(require('@/assets/game/table-ipad.png'));
      //     setdimensions(ipaddimensions);
      //     break;
      //   case "desktop":
      //     setTableImage(require('@/assets/game/table-desktop.png'));
      //     setdimensions(desktopdimensions);
      //     break;
      //   case "largeDesktop":
      //     setTableImage(require('@/assets/game/board-bg.png'));
      //     break;
      // }
    };

    updateTableImage(); // Set the initial table image
    const subscription = Dimensions.addEventListener("change", updateTableImage);

    return () => {subscription?.remove();}
  }, []);

  return (
    <View 
    style={{marginHorizontal: 'auto', width: 'auto', maxWidth: 3000}}
    >
      <View style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
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
        {/* {showTimeBankAnimation && (
          <TimeBankAnimation setShowTimeBankAnimation={setShowTimeBankAnimation} />
        )} */}
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
        <View style={{ height: smallIphonedimensions.height, width: smallIphonedimensions.width, position: 'relative',  top: 0, maxHeight: 750, maxWidth: 1700}}>
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            marginBottom: dimensions.marginBottom, marginLeft: dimensions.marginLeft,
            display: 'flex',
            }}
          >
            <Image source={tableImage} style={styles.tableImage} />
          </View>
          {/* Player */}
          {gameState?.players.map((player, index) => (
            <Player
              key={player? player.id : `empty-seat-${index}` }
              player={
                player
                  ? {
                      ...player,
                      bet: player.bet / 100,
                      totalHands: player.totalHands / 100 || 0,
                      chips: player.chips / 100,
                      potContribution: player.potContribution / 100,
                    }
                  : null
              }
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
              activeEmote={player ? activeEmotes[player.uuid] : null}
              isEmoteVisible={player? isEmoteVisible[player.uuid] : false}
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
            key={`${gameState?.gameStage}-${gameState?.startTurnTimeStamp}-${gameState?.gameOverTimeStamp}`} // This ensures a re-render when gameState changes
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
            <View >
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
            </View>
          )}
          {/* {screenSize !== "smallIphone" && (
            <CurrentBestHand
              currentBestHand={currentBestHand ?? ""}
              gameStage={gameState?.gameStage ?? ""}
              shouldShowWin={shouldShowWin}
            />
          )} */}
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
  tableSubContainer: {
    display: 'flex',
    position: 'absoulte',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justityContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  tableImage: {
    marginTop: 50,
    // left: 5,
    width: '100%',
    resizeMode:'stretch',
    height: smallIphonedimensions.height,
  },
});

export default GameplayPokerMain;

