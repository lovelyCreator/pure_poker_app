export interface GameState {
    waitingPlayers: [];
    players: {
      playedTheHand: boolean;
      hasActed: boolean;
      chips: number;
      hasLeft: boolean;
      isReady: boolean;
      totalHands: number;
      inactivityCount: number;
      inHand: boolean; // False if fold
      isAllIn: boolean;
      bet: number;
      profilePicture: string;
      handDescription: null;
      animBet: number; // remove this, unused
      previousBet: number;
      potContribution: number;
      amountWon: number;
      bestHand: string;
      id: string;
      uuid: string;
      position: number;
      handsPlayed: number;
      buyIn: number;
      hand: []; // Array of cards is empty no show
      sitOutNextHand: boolean;
      sittingOut: boolean;
      canRaise: boolean;
      needsToWait: boolean;
      foldToAny: boolean;
      buyBackIn: number;
      boughtChips: number;
      showCards: boolean[];
      timeBanksRemaining: number;
      extraTime: number;
      username: string;
      bombPotDecision: "optIn" | "optOut" | "veto";
    }[];
    creatorId: string;
    gameInProgress: boolean;
    groups: string[];
    gameStage: string;
    communityCards: [];
    gameStarted: boolean;
    minPlayers: number;
    minRaiseAmount: number;
    netWinners: [];
    currentTurn: number;
    dealerIndex: number;
    initialBigBlind: number;
    pot: number;
    playerCount: number;
    deck: null;
    inactivityCheckArn: string;
    gameOverTimeStamp: null;
    bettingStarted: boolean;
    gameId: string;
    maxPlayers: number;
    highestBet: number;
    // Assuming each player who is joining has a field `{playerId}Joining`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Include a flexible key for dynamic player fields
    startTurnTimeStamp: string | null;
    endTurnTimeStamp: string | null;
    creationTimeStamp: string;
    gameIsAllIn: "preFlop" | "flop" | "turn" | "river";
    isBeginningOfTheHand: boolean;
    lastMove: { 
      lastMovePerformed: "CHECK" | "FOLD" | "CALL" | "RAISE" | "BET";
      playerWhoMadeTheLastMove: string; // this is the uuid
    } | null; // it's null if no move was performed.
    chatMessages: { username: string; message: string; time: string }[];
    isBombPotProposed: boolean;
    bombPotSettings: {
      numberOfBigBlinds: number,
      postFlopBetting: boolean,
      initiatorUsername: string
    },
    bombPotActive: boolean;
    waitTimeCheckFold: number;
  }
  
  export interface Player {
    playedTheHand: boolean;
    hasActed: boolean;
    chips: number;
    hasLeft: boolean;
    isReady: boolean;
    totalHands: number;
    inactivityCount: number;
    inHand: boolean;
    isAllIn: boolean;
    bet: number;
    profilePicture: string;
    animBet: number; // remove this, unused
    buyIn: number;
    previousBet: number;
    handDescription: string | null;
    potContribution: number;
    amountWon: number;
    bestHand: string;
    id: string;
    uuid: string;
    position: number;
    handsPlayed: number;
    hand: []; // Assuming a list of cards, update accordingly if it's different
    sitOutNextHand: boolean;
    sittingOut: boolean;
    canRaise: boolean;
    needsToWait: boolean;
    foldToAny: boolean;
    buyBackIn: number;
    boughtChips: number;
    showCards: boolean[];
    timeBanksRemaining: number;
    extraTime: number;
    username: string;
    bombPotDecision: "optIn" | "optOut" | "veto";
  }
  
  export interface testingEndpoint {
    action: "testingEndpoint";
    gameId: string;
    playerId: string;
    gameAction: string;
    buyIn: number | null;
    raiseAmount: number | null;
  }
  
  export interface sendPokerAction {
    action: "sendPokerAction";
    gameId: string;
    gameAction:
      | "joinGame"
      | "leaveGame"
      | "playerCall"
      | "playerCheck"
      | "playerRaise"
      | "playerFold"
      | "sitOutNextHand"
      | "buyBackIn"
      | "buyMoreChips"
      | "showCards"
      | "sendPokerChatMessage"
      | "sendEmote"
      | "addTime"
      | "createBombPot"
      | "makeBombPotDecision"
    buyIn?: number | null;
    raiseAmount?: number | null;
    groups?: string[] | null;
    cardBools?: boolean[] | null;
    message?: string | null;
    emote?: string | null;
    additionalSeconds?: number | null;
    bombPotSettings?: {
      numberOfBigBlinds: number,
      postFlopBetting: boolean,
      initiatorUsername: string
    },
    seatPosition?: number;
    bombPotDecision?: string;
    radarToken?: string;
  }
  
  export interface createGame {
    action: "createGame";
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
    bigBlind: number;
    buyIn: number;
    groups: string[];
    radarToken: string;
  }
  
  export interface joinGame {
    action: "joinGame";
    gameId: string;
    playerWhoJoined: string;
    buyIn: number | null;
    groups: string[];
  }
  
  export interface leaveGame {
    action: "leaveGame";
    gameId: string;
    playerId: string;
  }
  
  export interface playerCall {
    action: "playerCall";
    gameId: string;
    playerId: string;
  }
  
  export interface playerCheck {
    action: "playerCheck";
  
    gameId: string;
    playerId: string;
  }
  
  export interface playerFold {
    action: "playerFold";
    gameId: string;
    playerId: string;
  }
  
  export interface playerRaise {
    action: "playerRaise";
    raiseAmount: number;
    gameId: string;
    playerId: string;
  }
  
  export interface playerReady {
    action: "playerReady";
    gameId: string;
    playerId: string;
  }
  
  export interface validateGame {
    action: "validateGame";
    gameId: string;
    playerId: string;
  }
  
  export interface WebSocketMessage {
    action: string;
    message: string;
    statusCode: number;
    gameDetails: GameState;
    playerId: string | null;
  }
  
  // Type definition for Game
  export interface AvailableGame {
    gameId: string;
    creatorUsername: string;
    playerCount: number;
    maxPlayers: number;
    initialBigBlind: number;
    creationTimeStamp: string;
    isUserInGame: boolean;
  }
  
  export type PokerActions = sendPokerAction;
  
  // export type PokerActions =
  //   | createGame
  //   | joinGame
  //   | leaveGame
  //   | playerCall
  //   | playerCheck
  //   | playerFold
  //   | playerRaise
  //   | playerReady
  //   | validateGame;
  