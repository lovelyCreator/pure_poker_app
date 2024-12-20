import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';
import useWebSocket from 'react-use-websocket';
import { fetchGameState, getPokerUrl, playSound } from '@/lib/poker'; // Adjust the import path as necessary
import useGameState from '@/hooks/useGameState';
import { useSearchParams } from 'expo-router/build/hooks';
import GamePlayPoker from "@/components/custom/poker/GamePlayPoker";
import { useAuth } from '@/hooks/useAuth';
import PlayPokerNav from "@/components/custom/poker/PlayPokerNav";
import { toast } from 'sonner';
import assert from "assert";
import type { PokerActionsFrontend } from '@/types/pokerFrontend.';
import JoinPopup from "@/components/custom/poker/JoinPopup";
import { useNavigation } from 'expo-router';
import { SpanInheritor, SpanWrapper, useSpan } from '@/utils/logging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Poker() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const span = useSpan("PokerPage", { gameId: gameId });

  const navigation = useNavigation();
  const user = useAuth()

  const gameStateQuery = useGameState(gameId!)
  const [gameState, setGameState] = useState(gameStateQuery.data);
  const [lastSynced, setLastSynced] = useState(Date.now());

  const [vpip, setVpip] = useState(0);
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  const [isSpectator, setIsSpectator] = useState(false);
  const [isSittingOut, setISSittingOut] = useState(false);
  const [isSittingOutNextHand, setIsSittingOutNextHand] = useState(false);
  const [allBoardCardsRevealed, setAllBoardCardsRevealed] = useState(false);
  
  const [showDealingAnimation, setShowDealingAnimation] = useState(false);

  const [activeEmotes, setActiveEmotes] = useState<Record<string, string | null>>({});
  const [isEmoteVisible, setIsEmoteVisible] = useState<Record<string, boolean>>({});
  const [showEmoteButtonSelector, setShowEmoteButtonSelector] = useState(true);
  const [isEmoteSelectorVisible, setIsEmoteSelectorVisible] = useState(false);
  const [showTimeBankAnimation, setShowTimeBankAnimation] = useState(false);
  const [previousCommunityCards, setPreviousCommunityCards] = useState<string[]>([]);
  const [shouldShowWin, setShouldShowWin] = useState(false);
  const [showBombPotDecisionModal, setShowBombPotDecisionModal] = useState(false);

  const initialDisplayBB = searchParams.get("displayBB") === "true";
  const [displayBB, setDisplayBB] = useState(initialDisplayBB);
  const initialPlaySound = searchParams.get("playSoundEnabled") ? searchParams.get("playSoundEnabled") === "true" : true;
  const [playSoundEnabled, setPlaySoundEnabled] = useState(initialPlaySound);

  const { getWebSocket, sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId ?? "", user.username),
    {
      share: true,
      onOpen: async () => {
        const token = await AsyncStorage.getItem("PP_TOKEN");
        if(!token) {
          toast.error(
            "You need to be logged in to play poker. Try to refresh the page.",
          );
        }
        sendJsonMessage({
          action: "authenticate",
          token: token,
        });
      },
      onMessage: (event) => {
        try {
          // assert(typeof event.data === "string", "Event is not a string");
          const res = JSON.parse(event.data) as PokerActionsFrontend;

          const emote = res.action === "showEmote" ? res.message.emote : "";
          if (playSoundEnabled) {
            playSound(res.action, res.gameDetails, emote);
          }

          if (res.action === "badRequest") {
            toast.dismiss()
            toast.error(res.message);
            if (res.gameDetails) {
              setGameState(res.gameDetails);
            }
            return;
          } else if (res.action === "showEmote") {
            // Call the function to display the emote for the player
            showEmoteForPlayer(res.message.playerId, res.message.emote);
          } else if (res.action === "leaveGamePlayer") {
            // router.push("/home");
            navigation.navigate('home')
            return;
          } else {
            setGameState(res.gameDetails);
            setLastSynced(Date.now());

            if (res.action === "playerReady") {
              console.log("BEGINNING 1");
              setShowBombPotDecisionModal(false);
              setShouldShowWin(false);
              setPreviousCommunityCards([]);
              setAllBoardCardsRevealed(false);
              setShowDealingAnimation(true);
            }

            if (res.action === "createBombPot") {
              toast.info(`${res.gameDetails.bombPotSettings.initiatorUsername} just created a bomb pot!`);
            }

            if (res.gameDetails.isBeginningOfTheHand) {
              if (res.action === "joinGame" && res.gameDetails.waitingPlayers.length === 0){ // this means it's a player that joined and triggered the game to start
                setShowDealingAnimation(true);
              }
            }
            if (res.action === "addTime") {
              // Handle the addTime action here
              setShowTimeBankAnimation(true);
            }
          }
          if (res.action === "joinGamePlayer" && res.statusCode === 200) {
            setShowJoinPopup(false);
            toast.dismiss();
            toast.success("Successfully joined the game!");
          } else if ((res.action === "joinGame") && res.statusCode === 200) {
            if (res.playerWhoJoined !== user.username) {
              toast.info(`${res.playerWhoJoined} joined the game.`);
            } else {
              toast.dismiss();
              setShowJoinPopup(false);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  );

  useEffect(() => {
    if (!gameState) {
      // router.push("/404");
      navigation.navigate('404')
    } else {
      const playerId = user.username;
      const isPlayerInGame = gameState.players.some(
        (player) => player.id === playerId,
      );
      const isPlayerWaitingInGame = gameState.waitingPlayers.some(
        (player) => player[2] === playerId,
      );

      if (!isPlayerInGame && !isPlayerWaitingInGame && !isSpectator) {
        setShowJoinPopup(true);
      }

      gameState.players.forEach((player) => {
        if (player.id === playerId) {
          setVpip(
            player.totalHands > 0
              ? Number(
                  ((player.handsPlayed / player.totalHands) * 100).toFixed(1),
                )
              : 0,
          );
        }
      });
    }
  }, [gameState, user.username, navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastSync = (now - lastSynced) / 1000; // Time in seconds
  
      if (timeSinceLastSync > 3) {
        // console.log("Game state is stale. Refreshing...");
        fetchGameState(gameId!)
        .then((gameData) => {
          if (gameData) {
            setGameState(gameData);
            setLastSynced(Date.now()); // Update last synced time
          }
        })
        .catch((error) => {
          console.error("Error refreshing game state:", error);
        });
      }
    }, 2000); // Check every 2 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [lastSynced, gameState]);

  //Function to handle displaying an emote
  const showEmoteForPlayer = (playerId: string, emote: string) => {
    setActiveEmotes((prev) => ({ ...prev, [playerId]: emote }));
    setIsEmoteVisible((prev) => ({ ...prev, [playerId]: true }));
    if (playerId === user.id) {
      setShowEmoteButtonSelector(false);
      setIsEmoteSelectorVisible(false);
    }

    // Hide the emote after 2 seconds
    setTimeout(() => {
      setIsEmoteVisible((prev) => ({ ...prev, [playerId]: false }));
      if (playerId === user.id) {
        setShowEmoteButtonSelector(true);
      }
    }, 2000);
  };

  return (
    <SpanInheritor span={span}>
      <View className="gameplay-poker">
        <SpanWrapper name="PlayPokerNav">
          <PlayPokerNav
            playerId={user.username}
            gameId={gameId ?? ""}
            gameState={gameState ?? undefined}
            vpip={vpip}
            buyIn={
              gameState?.players.find((p) => p.id === user.username)?.buyIn ?? 0
            }
            gameChips={
              gameState?.players.find((p) => p.id === user.username)?.chips ?? 0
            }
            playerBalance={user.chips}
            isSpectator={isSpectator}
            allBoardCardsRevealed={allBoardCardsRevealed}
            setAllBoardCardsRevealed={setAllBoardCardsRevealed}
            isSittingOutNextHand={isSittingOutNextHand}
            setIsSittingOutNextHand={setIsSittingOutNextHand}
            displayBB={displayBB}
            setDisplayBB={setDisplayBB}
            playSoundEnabled={playSoundEnabled}
            setPlaySoundEnabled={setPlaySoundEnabled}
          />
        </SpanWrapper>
        <SpanWrapper name="PlayPokerGame">
          <GamePlayPoker
            gameId={gameId ?? ""}
            gameState={gameState ?? undefined}
            currentPlayerId={
              gameState?.players[gameState.currentTurn]?.id ?? null
            }
            playerId={user.username}
            isSpectator={isSpectator}
            isSittingOut={isSittingOut}
            isSittingOutNextHand={isSittingOutNextHand}
            allBoardCardsRevealed={allBoardCardsRevealed}
            showDealingAnimation={showDealingAnimation}
            setAllBoardCardsRevealed={setAllBoardCardsRevealed}
            setIsSittingOut={setISSittingOut}
            setIsSittingOutNextHand={setIsSittingOutNextHand}
            setShowDealingAnimation={setShowDealingAnimation}
            activeEmotes={activeEmotes}
            isEmoteVisible={isEmoteVisible}
            showEmoteButtonSelector={showEmoteButtonSelector}
            isEmoteSelectorVisible={isEmoteSelectorVisible}
            setIsEmoteSelectorVisible={setIsEmoteSelectorVisible}
            showTimeBankAnimation={showTimeBankAnimation}
            setShowTimeBankAnimation={setShowTimeBankAnimation}
            displayBB={displayBB}
            setDisplayBB={setDisplayBB}
            playSoundEnabled={playSoundEnabled}
            previousCommunityCards={previousCommunityCards}
            setPreviousCommunityCards={setPreviousCommunityCards}
            shouldShowWin={shouldShowWin}
            setShouldShowWin={setShouldShowWin}
            showBombPotDecisionModal={showBombPotDecisionModal}
            setShowBombPotDecisionModal={setShowBombPotDecisionModal}
          />
        </SpanWrapper>

        {showJoinPopup && (
          <JoinPopup
            userIsVerified={user.clearApproval === "approved"}
            gameId={gameId!}
            setShowJoinPopup={setShowJoinPopup}
            setIsSpectator={setIsSpectator}
          />
        )}
      </View>
    </SpanInheritor>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
});

