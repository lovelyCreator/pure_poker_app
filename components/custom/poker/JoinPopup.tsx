import React from "react";
import { Button } from "@/components/ui/button";
import CreateOrJoinGame from "../dialog/CreateOrJoinGame";

interface JoinPopupProps {
  userIsVerified: boolean;
  gameId?: string;
  setShowJoinPopup: (value: boolean) => void;
  setIsSpectator: (value: boolean) => void;
}

const JoinPopup: React.FC<JoinPopupProps> = ({
  userIsVerified,
  gameId = "",
  setShowJoinPopup,
  setIsSpectator,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative z-60 mx-auto max-w-[300px] md:max-w-md rounded-md bg-[#212530] p-6 md:p-10 text-center shadow-lg">
        <span className="mb-6 block text-m md:text-lg text-white">
          You haven&apos;t joined this game yet. Would you like to play or spectate?
        </span>
        <div className="flex justify-center">
          <CreateOrJoinGame
            userIsVerified={userIsVerified}
            isCreateGame={false}
            defaultGameId={gameId}
          >
            <Button
              className={`bg-blue-500 text-white hover:bg-blue-600 ${
                !userIsVerified ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={!userIsVerified}
            >
              Join Game
            </Button>
          </CreateOrJoinGame>
          <Button
            className="ml-4 bg-gray-500 text-white hover:bg-gray-600"
            onPress={() => {
              setShowJoinPopup(false);
              setIsSpectator(true);
            }}
          >
            Spectate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinPopup;
