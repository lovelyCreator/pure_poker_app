import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { toast } from "sonner";
import useWebSocket from "react-use-websocket";
import { useSpan } from "@/utils/logging";
import { getPokerUrl } from "@/lib/poker";
import { useAuth } from "@/hooks/useAuth";
import type { sendPokerAction } from "@/types/poker";
import assert from "assert";
import type { PokerActionsFrontend } from "@/types/pokerFrontend";
import { View, StyleSheet, Image, Text } from 'react-native'

interface AllInPopupProps {
  isOpen: boolean;
  gameId: string;
  playerId: string;
  playerBalance: number;
  boughtChips: number;
  bigBlind: number;
}

const AllInPopup: React.FC<AllInPopupProps> = ({
  isOpen,
  gameId,
  playerId,
  playerBalance,
  boughtChips,
  bigBlind,
}) => {
  const span = useSpan("AllInPopup");
  const user = useAuth();
  const [showBuyChipsInput, setShowBuyChipsInput] = useState(false);
  const [chipsToBuy, setChipsToBuy] = useState(50 * bigBlind / 100);
  const [inputError, setInputError] = useState<string | null>(null);

  const minBuy = 50 * bigBlind / 100;
  const maxBuy = 250 * bigBlind / 100;

  const { sendJsonMessage } = useWebSocket(
    getPokerUrl(span, gameId, user.username),
    {
      share: true,
      onMessage: (event) => {
        try {
          assert(typeof event.data === "string", "Event is not a string");
          const data: PokerActionsFrontend = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (e) {
          console.log(e);
          toast.error("Failed to process the action.");
        }
      },
    }
  );

  useEffect(() => {
    setChipsToBuy(50 * bigBlind / 100);
  }, [bigBlind]);

  const handleWebSocketMessage = (data: PokerActionsFrontend) => {
    if (data.action === "buyBackIn") {
      data.statusCode === 200 ? toast.success("Successfully bought chips!") : toast.error("Failed to buy chips.");
    } else if (data.action === "leaveGame" && (data.statusCode === 200 || data.statusCode === 202)) {
      toast.success(data.statusCode === 202 ? "Successfully left the game!" : "");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setChipsToBuy(value);
    validateInput(value);
  };

  const validateInput = (value: number) => {
    if (value < minBuy) {
      setInputError(`Buy-in must be at least ${minBuy} chips.`);
    } else if (value > maxBuy) {
      setInputError(`Buy-in cannot exceed ${maxBuy} chips.`);
    } else if (value > playerBalance) {
      setInputError("Buy-in cannot exceed your balance.");
    } else {
      setInputError(null);
    }
  };

  const handleBuyChips = () => {
    if (chipsToBuy >= minBuy && chipsToBuy <= maxBuy) {
      const buyBackInMessage: sendPokerAction = {
        action: "sendPokerAction",
        gameId,
        gameAction: "buyBackIn",
        buyIn: chipsToBuy * 100,
        raiseAmount: null,
        groups: null
      };
      sendJsonMessage(buyBackInMessage);
      toast.loading("Processing your buy-in...");
    } else {
      toast.error(`Buy-in must be between ${minBuy} and ${maxBuy} chips.`);
    }
  };

  const handleLeaveGame = () => {
    span.info("User confirmed they want to leave the game. Attempting to exit.");
    const leaveGameMessage: sendPokerAction = {
      action: "sendPokerAction",
      gameId,
      gameAction: "leaveGame",
      buyIn: null,
      raiseAmount: null,
      groups: null,
    };
    sendJsonMessage(leaveGameMessage);
    toast.loading("Leaving game...");
  };

  return (
    <Dialog open={isOpen} backgroundBlur={false} showX={false}>
      <DialogContent className="fixed left-1/2 top-1/2 md:ml-6 transform w-[300px] md:w-[400px] bg-[#212530] rounded-[20px] border border-[#313543] p-6 flex flex-col items-center justify-center">
        {!showBuyChipsInput ? (
          <>
            <div className="w-24 h-24 bg-[#2D3140] rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2 text-center">Sorry! You ran out of chips</h2>
            <Button
              onClick={() => setShowBuyChipsInput(!showBuyChipsInput)}
              className="w-full h-12 bg-[#3B82F6] text-white rounded-lg mt-6 mb-3"
            >
              Buy chips
            </Button>
          </>
        ) : (
          <div className="w-full mb-3">
            <div className="mb-4">
              <label htmlFor="chipAmount" className="block text-sm font-medium text-gray-300 mb-2">
                How many chips do you want to buy?
              </label>
              <input
                type="number"
                id="chipAmount"
                value={chipsToBuy}
                onChange={handleInputChange}
                className="w-full p-2 bg-[#161922] text-white border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter amount (${minBuy}-${maxBuy})`}
              />
              {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
            </div>
            <div className="flex items-center mb-4">
              <Image source={require('@/assets/home/icon/coin.png')} alt="coin" className="mr-2" />
              <p className="text-gray-300">Current Balance: {playerBalance}</p>
            </div>
            <div className="flex items-center mb-6">
              <Image source={require('@/assets/home/icon/coin.png')} alt="coin" className="mr-2" />
              <p className="text-gray-300">New Balance: {playerBalance - chipsToBuy}</p>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Note: Buy-in must be between {minBuy} and {maxBuy} chips.
            </p>
            <Button
              onClick={handleBuyChips}
              className="w-full h-12 bg-[#3B82F6] text-white rounded-lg mb-3"
              disabled={!!inputError}
            >
              Confirm Buy-in
            </Button>
          </div>
        )}
        <Button
          onClick={handleLeaveGame}
          variant="outline"
          className="w-full h-12 bg-transparent border border-[#3B82F6] text-[#3B82F6] rounded-lg"
        >
          End game
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AllInPopup;
