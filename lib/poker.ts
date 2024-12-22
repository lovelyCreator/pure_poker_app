import { env } from "@/env";
import { Player, type PokerActions } from "@/types/poker";
import { type SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { type Span } from "@/utils/logging";
// import { GameState } from "@pure-poker/poker-api-rest";
import { type GameState } from "@/types/poker";
import { refreshToken } from "@/lib/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "lucide-react-native";

export const chipsToBB = (chips: number, initialBigBlind: number): number => {
    if (initialBigBlind <= 0) {
      throw new Error("Initial Big Blind must be greater than 0.");
    }
    return (chips / initialBigBlind) * 100;
  };
  
  export function getPokerUrl(
    o_span: Span,
    gameId?: string,
    playerId?: string,
  ): string {
    const span = o_span.span("getPokerUrl", { playerId})
    // const span = o_span.span("getPokerUrl", { playerId });
  
    span.info("Constructing query string");
    
    const queryParams = [];
    if (gameId) {
      queryParams.push(`gameId=${encodeURIComponent(gameId)}`);
    }
    
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const res = `${env.NEXT_PUBLIC_POKER_WEB_SOCKET_URL}${queryString}`;
    console.log('websocket_URL : ', res)
    span.info("Query string created", { queryString: res });
  
    return res;
  }

  /**
 * Fetches the game state for a given game ID.
 * Handles token refresh and errors gracefully.
 * 
 * @param {string} gameId - The ID of the game.
 * @returns {Promise<GameState | null>} - The game state or null if not found/unauthorized.
 */

  interface GetItemQuery {
    gameId: any
  }
  
export async function fetchGameState(gameId: string): Promise<GameState | null> {
  const navigation = useNavigation();
    async function fetchFromApi(gameId: string) {
      // const query = { gameId };
      // const url = new URL(env.NEXT_PUBLIC_POKER_URL);

      // Object.keys(query).forEach(key => url.searchParams.append(key, query[key as keyof GetItemQuery]));
      // console.log(url, 'URL')
      const token = await AsyncStorage.getItem('PP_TOKEN');
      const res = await fetch(`${env.NEXT_PUBLIC_POKER_URL}poker?gameId=${encodeURIComponent(gameId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Add any other headers if needed, e.g., Authorization
        },
      });
      // const res = await pokerApi.poker.$get({ query: { gameId } });
      if (res.ok) {
        return [await res.json(), false];
      }
      if (res.status === 401 || res.status === 404) {
        return [null, true];
      }
      if (!res.ok) {
        const error = await res.json();
        if ("message" in error) {
          // eslint-disable-next-line
          throw new Error(error.message);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
      return [null, false]; // Default fallback
    }
  
    let [gameState, isUnauthorized] = await fetchFromApi(gameId);
  
    if (isUnauthorized) {
      await refreshToken(); // Refresh the token
      [gameState, isUnauthorized] = await fetchFromApi(gameId);
  
      if (isUnauthorized) {
        // Token refresh failed, force reload
        // window.location.reload();
        navigation.navigate('playPoker', gameId={gameId})
      }
    }
  
    return gameState;
  }

  // Helper to determine font size based on username length and screen size
export const usernameLengthToFontSize = (
    length: number,
    screenSize: ScreenSize,
  ) => {
    switch (screenSize) {
      case "largeDesktop":
        if (length < 6) return "text-2xl";
        if (length < 10) return "text-xl";
        if (length < 12) return "text-lg";
        return "text-m";
      case "desktop":
        if (length < 6) return "text-xl";
        if (length < 10) return "text-lg";
        if (length < 12) return "text-m";
        return "text-sm";
      case "ipad":
        if (length < 6) return "text-lg";
        if (length < 10) return "text-m";
        if (length < 12) return "text-sm";
        return "text-xs";
      case "smallIphone":
        if (length < 6) return "text-[14px]";
        if (length < 10) return "text-[12px]";
        if (length < 12) return "text-[10px]";
        return "text-[10px]";
      default:
        return "text-sm"; // Default case
    }
  };
  
  export function sendPokerMessage(
    sendJsonMesssage: SendJsonMessage,
    message: PokerActions,
  ) {
    sendJsonMesssage(message);
  }
  
  export type ScreenSize = "desktop" | "ipad" | "smallIphone" | "largeDesktop";
  
  export const getScreenSize = (): ScreenSize => {
    // if (window.innerWidth < 720) return "smallIphone";
    // if (window.innerWidth < 1310) return "ipad";
    // if (window.innerWidth < 1740) return "desktop";
    // return "largeDesktop";
    return "smallIphone";
  };
  
  export const betAndButtonPositions = {
    one: {
      betPosition: {
        left: 19.0,
        top: -15.0,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    onevone: {
      betPosition: {
        left: 0.0,
        top: 180.0,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    two: {
      betPosition: {
        left: 80,
        top: -10,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    three: {
      betPosition: {
        left: 150,
        top: 40,
      },
      buttonPosition: {
        left: 22,
        top: 20,
      },
    },
    four: {
      betPosition: {
        left: 135,
        top: 130,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    five: {
      betPosition: {
        left: 70,
        top: 175,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    six: {
      betPosition: {
        left: -20,
        top: 170,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    seven: {
      betPosition: {
        left: -60,
        top: 150,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    eight: {
      betPosition: {
        left: -70,
        top: 40,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
    nine: {
      betPosition: {
        left: -30,
        top: -10,
      },
      buttonPosition: {
        left: 22,
        top: -5,
      },
    },
  };
  
  // Responsive Player Positions for Each Screen Size
const playerPositionsByScreen: Record<
ScreenSize,
Record<
  string,
  { leftPosition: number | string; topPosition: number | string }
>
> = {
  desktop: {
    one: { leftPosition: "50%", topPosition: "89%" },
    onevone: { leftPosition: "50%", topPosition: "-6%" },
    two: { leftPosition: "10%", topPosition: "81%" },
    twoBis: { leftPosition: "3%", topPosition: "65%" },
    twoBisBis: { leftPosition: "6%", topPosition: "73%" },
    three: { leftPosition: "1%", topPosition: "42%" }, // horiz middle left
    threeBis: { leftPosition: "3%", topPosition: "18%" },
    threeBisBis: { leftPosition: "6%", topPosition: "8%" },
    four: { leftPosition: "10%", topPosition: "1%" },
    fourBis: { leftPosition: "22%", topPosition: "-6%" },
    five: { leftPosition: "34%", topPosition: "-6%" },
    six: { leftPosition: "66%", topPosition: "-6%" },
    sixBis: { leftPosition: "78%", topPosition: "-6%" },
    seven: { leftPosition: "89%", topPosition: "0%" },
    sevenBis: { leftPosition: "97%", topPosition: "18%" },
    sevenBisBis: { leftPosition: "94%", topPosition: "8%" },
    eight: { leftPosition: "99%", topPosition: "42%" }, // horiz middle right
    eightBis: { leftPosition: "97%", topPosition: "65%" },
    eightBisBis: { leftPosition: "94%", topPosition: "73%" },
    nine: { leftPosition: "89%", topPosition: "81%" },
  },
  ipad: {
    one: { leftPosition: "50%", topPosition: "88%" },
    onevone: { leftPosition: "50%", topPosition: "-3%" },
    two: { leftPosition: "15%", topPosition: "71%" },
    twoBis: { leftPosition: "11%", topPosition: "63%" },
    twoBisBis: { leftPosition: "16%", topPosition: "73%" },
    three: { leftPosition: "7%", topPosition: "41%" }, // horiz middle left
    threeBis: { leftPosition: "10%", topPosition: "16%" },
    threeBisBis: { leftPosition: "16%", topPosition: "4%" },
    four: { leftPosition: "14%", topPosition: "6%" },
    fourBis: { leftPosition: "26%", topPosition: "-3%" },
    five: { leftPosition: "34%", topPosition: "-3%" },
    six: { leftPosition: "66%", topPosition: "-3%" },
    sixBis: { leftPosition: "73%", topPosition: "-3%" },
    seven: { leftPosition: "84%", topPosition: "6%" },
    sevenBis: { leftPosition: "88%", topPosition: "16%" },
    sevenBisBis: { leftPosition: "83%", topPosition: "4%" },
    eight: { leftPosition: "91%", topPosition: "41%" }, // horiz middle right
    eightBis: { leftPosition: "87%", topPosition: "63%" },
    eightBisBis: { leftPosition: "83%", topPosition: "73%" },
    nine: { leftPosition: "84%", topPosition: "71%" },
  },
  smallIphone: {
    one: { leftPosition: "50%", topPosition: "96.5%" },
    onevone: { leftPosition: "50%", topPosition: "8%" },
    two: { leftPosition: "11%", topPosition: "86%" },
    twoBis: { leftPosition: "11%", topPosition: "86%" },
    twoBisBis: { leftPosition: "3%", topPosition: "64%" },
    three: { leftPosition: "3%", topPosition: "64%" },
    threeBis: { leftPosition: "3%", topPosition: "64%" },
    threeBisBis: { leftPosition: "4%", topPosition: "30%" },
    four: { leftPosition: "4%", topPosition: "30%" },
    fourBis: { leftPosition: "4%", topPosition: "30%" },
    five: { leftPosition: "28%", topPosition: "10%" },
    six: { leftPosition: "70%", topPosition: "10%" },
    sixBis: { leftPosition: "96%", topPosition: "30%" },
    seven: { leftPosition: "96%", topPosition: "30%" },
    sevenBis: { leftPosition: "97%", topPosition: "64%" },
    sevenBisBis: { leftPosition: "96%", topPosition: "30%" },
    eight: { leftPosition: "97%", topPosition: "64%" },
    eightBis: { leftPosition: "88%", topPosition: "86%" },
    eightBisBis: { leftPosition: "97%", topPosition: "64%" },
    nine: { leftPosition: "88%", topPosition: "86%" },
  },
  largeDesktop: {
    one: { leftPosition: "50%", topPosition: "89%" },
    onevone: { leftPosition: "50%", topPosition: "-6%" },
    two: { leftPosition: "12%", topPosition: "85%" },
    twoBis: { leftPosition: "3%", topPosition: "65%" },
    twoBisBis: { leftPosition: "6%", topPosition: "76%" },
    three: { leftPosition: "1%", topPosition: "43%" }, // horiz middle left
    threeBis: { leftPosition: "3%", topPosition: "20%" },
    threeBisBis: { leftPosition: "6%", topPosition: "8%" },
    four: { leftPosition: "10%", topPosition: "1%" },
    fourBis: { leftPosition: "22%", topPosition: "-6%" },
    five: { leftPosition: "34%", topPosition: "-6%" },
    six: { leftPosition: "66%", topPosition: "-6%" },
    sixBis: { leftPosition: "78%", topPosition: "-6%" },
    seven: { leftPosition: "89%", topPosition: "0%" },
    sevenBis: { leftPosition: "97%", topPosition: "20%" },
    sevenBisBis: { leftPosition: "94%", topPosition: "8%" },
    eight: { leftPosition: "99%", topPosition: "43%" }, // horiz middle right
    eightBis: { leftPosition: "97%", topPosition: "65%" },
    eightBisBis: { leftPosition: "94%", topPosition: "76%" },
    nine: { leftPosition: "89%", topPosition: "84%" },
  },
};

export const getBettingPositions = (screenSize: string) => {
const multiplicator = screenSize === "smallIphone" ? 0.7 : 1;
return {
  one: {
    betPosition: {
      left: 15.0,
      top: -15.0 * multiplicator,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  onevone: {
    betPosition: {
      left: 20.0,
      top: 180.0 * multiplicator,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  two: {
    betPosition: {
      left: 80 * multiplicator,
      top: -10,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  three: {
    betPosition: {
      left: 150 * multiplicator,
      top: 40,
    },
    buttonPosition: {
      left: 22,
      top: 20,
    },
  },
  four: {
    betPosition: {
      left: 135 * multiplicator,
      top: 130 * multiplicator,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  five: {
    betPosition: {
      left: 70,
      top: 175 * multiplicator,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  six: {
    betPosition: {
      left: -20,
      top: 170 * multiplicator,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  seven: {
    betPosition: {
      left: -60,
      top: 150 * multiplicator,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  eight: {
    betPosition: {
      left: -70,
      top: 40,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
  nine: {
    betPosition: {
      left: -30,
      top: -10,
    },
    buttonPosition: {
      left: 22,
      top: -5,
    },
  },
};
};

export const getWaitlistedPlayerPositions = (screenSize: ScreenSize) => {
const positions = getPlayerPositions(screenSize);
return [
  positions.one,
  positions.five,
  positions.four,
  positions.three,
  positions.seven,
  positions.six,
  positions.eight,
  positions.two,
  positions.nine,
];
};

export const getBettingAndDealerPositions = (screenSize: ScreenSize) => {
const positions = getBettingPositions(screenSize);
return [
  [positions.one],
  [positions.one, positions.onevone],
  [positions.one, positions.five, positions.six],
  [positions.one, positions.four, positions.five, positions.six],
  [
    positions.one,
    positions.four,
    positions.five,
    positions.six,
    positions.seven,
  ],
  [
    positions.one,
    positions.three,
    positions.four,
    positions.five,
    positions.six,
    positions.seven,
  ],
  [
    positions.one,
    positions.three,
    positions.four,
    positions.five,
    positions.six,
    positions.seven,
    positions.eight,
  ],
  [
    positions.one,
    positions.two,
    positions.three,
    positions.four,
    positions.five,
    positions.six,
    positions.seven,
    positions.eight,
  ],
  [
    positions.one,
    positions.two,
    positions.three,
    positions.four,
    positions.five,
    positions.six,
    positions.seven,
    positions.eight,
    positions.nine,
  ],
];
};

// Helper function to access the appropriate screen size
function getPlayerPositions(screenSize: ScreenSize, emptySeat=false) {
//   console.log("Get Player Positions", screenSize)
// switch (screenSize) {
//   case "smallIphone":
//     return playerPositionsByScreen.smallIphone;
//   case "ipad":
//     return playerPositionsByScreen.ipad;
//   case "desktop":
//     return playerPositionsByScreen.desktop;
//   case "largeDesktop":
//     return playerPositionsByScreen.largeDesktop;
//   default:
//     throw new Error("Invalid screen size");
// }
    return playerPositionsByScreen.smallIphone;
}

export const generatePlayerPositions = (screenSize: ScreenSize, emptySeat = false) => {
const positions = getPlayerPositions(screenSize, emptySeat);
// console.log(positions, "DesktopPosition")

return [
  [positions.one],
  [positions.one, positions.onevone],
  [positions.one, positions.four, positions.seven],
  [positions.one, positions.three, positions.onevone, positions.eight],
  [
    positions.one,
    positions.three,
    positions.fourBis,
    positions.sixBis,
    positions.eight,
  ],
  [
    positions.one,
    positions.twoBisBis,
    positions.threeBisBis,
    positions.onevone,
    positions.sevenBisBis,
    positions.eightBisBis,
  ],
  [
    positions.one,
    positions.twoBis,
    positions.threeBis,
    positions.five,
    positions.six,
    positions.sevenBis,
    positions.eightBis,
  ],
  [
    positions.one,
    positions.twoBis,
    positions.threeBis,
    positions.fourBis,
    positions.onevone,
    positions.sixBis,
    positions.sevenBis,
    positions.eightBis,
  ],
  [
    positions.one,
    positions.two,
    positions.three,
    positions.four,
    positions.five,
    positions.six,
    positions.seven,
    positions.eight,
    positions.nine,
  ],
];
};

export const getEasyBettingOptions = (
gameState: GameState,
currentPlayer: Player,
) => {
const { highestBet, pot, initialBigBlind, minRaiseAmount, gameStage } =
  gameState;
const maxChips = currentPlayer.chips + currentPlayer.bet;

// Type for betting options
type BettingOption = { label: string; amount: number };

// Function to filter valid options based on minRaiseAmount and player's available chips
const filterValidOptions = (options: BettingOption[]) => {
  const optionsToShow = options
    .map((option) => {
      // If player doesn't have enough chips for the option, adjust the amount to be all-in
      if (option.amount > maxChips) {
        return { ...option, amount: maxChips }; // Adjust the amount to all-in
      }
      return option;
    })
    .filter((option) => option.amount >= minRaiseAmount);

  // Ensure we return exactly 3 options
  if (optionsToShow.length === 3) {
    return optionsToShow;
  } else {
    return [];
  }
};

// Default fallback for nonsensical blinds or pot percentages
const relevantMultiplier = highestBet > 0 ? highestBet : initialBigBlind;
const fallbackBetOptions: BettingOption[] = [
  { label: "2x", amount: relevantMultiplier * 2 },
  { label: "3x", amount: relevantMultiplier * 3 },
  { label: "4x", amount: relevantMultiplier * 4 },
];

// Pre-flop: Use Big Blinds (BB) for betting
if (gameStage === "preFlop") {
  let bbOptions: BettingOption[] = [];

  // If minRaiseAmount is <= 2 BB, offer 2-3-4 BB options
  if (minRaiseAmount <= initialBigBlind * 2) {
    bbOptions = [
      { label: "2 BB", amount: initialBigBlind * 2 },
      { label: "3 BB", amount: initialBigBlind * 3 },
      { label: "4 BB", amount: initialBigBlind * 4 },
    ];
  }
  // If minRaiseAmount > 2 BB and <= 4 BB, offer 4-6-8 BB options
  else if (
    minRaiseAmount >= initialBigBlind * 2 &&
    minRaiseAmount <= initialBigBlind * 4
  ) {
    bbOptions = [
      { label: "4 BB", amount: initialBigBlind * 4 },
      { label: "6 BB", amount: initialBigBlind * 6 },
      { label: "8 BB", amount: initialBigBlind * 8 },
    ];
  }
  // If minRaiseAmount > 2 BB and <= 4 BB, offer 4-6-8 BB options
  else if (
    minRaiseAmount >= initialBigBlind * 4 &&
    minRaiseAmount <= initialBigBlind * 8
  ) {
    bbOptions = [
      { label: "8 BB", amount: initialBigBlind * 8 },
      { label: "12 BB", amount: initialBigBlind * 12 },
      { label: "15 BB", amount: initialBigBlind * 15 },
    ];
  }
  // If highestBet > 8 BB, offer 33-66-100% pot options
  else if (minRaiseAmount > initialBigBlind * 8) {
    bbOptions = [
      { label: "33%", amount: Math.floor(pot / 3) },
      { label: "66%", amount: Math.floor(pot / 3 * 2) },
      { label: "100%", amount: Math.floor(pot) },
    ];

    // If minRaiseAmount is > 33% pot, offer 50-75-100% pot options
    if (minRaiseAmount > Math.floor(pot / 3)) {
      bbOptions = [
        { label: "50%", amount: Math.floor(pot / 2) },
        { label: "75%", amount: Math.floor(pot / 4 * 3) },
        { label: "100%", amount: Math.floor(pot) },
      ];
    }

    // If minRaiseAmount > 50% pot, return no options
    if (
      minRaiseAmount > Math.floor(pot / 2) &&
      maxChips >= highestBet * 2
    ) {
      return fallbackBetOptions;
    }
  }

  // Return valid BB or pot options filtered by minRaiseAmount and player's chips
  return filterValidOptions(bbOptions);
}

// Post-flop: Use pot percentages for betting
if (gameStage !== "preFlop") {
  let potOptions: BettingOption[] = [
    { label: "33%", amount: Math.floor(pot / 3) },
    { label: "66%", amount: Math.floor(pot / 3 * 2) },
    { label: "100%", amount: Math.floor(pot) },
  ];

  // If minRaiseAmount > 33% pot, offer 50-75-100% pot options
  if (minRaiseAmount >= Math.floor(pot / 3)) {
    potOptions = [
      { label: "50%", amount: Math.floor(pot / 2) },
      { label: "75%", amount: Math.floor(pot / 4 * 3) },
      { label: "100%", amount: Math.floor(pot) },
    ];
  }

  // If minRaiseAmount > 2 BB and <= 4 BB, offer 4-6-8 BB options
  else if (
    minRaiseAmount >= initialBigBlind * 2 &&
    minRaiseAmount <= initialBigBlind * 4
  ) {
    potOptions = [
      { label: "4 BB", amount: initialBigBlind * 4 },
      { label: "6 BB", amount: initialBigBlind * 6 },
      { label: "8 BB", amount: initialBigBlind * 8 },
    ];
  }

  // If minRaiseAmount > 50% pot, return no options
  if (minRaiseAmount >= Math.floor(pot * 0.5) && maxChips >= highestBet * 2) {
    potOptions = fallbackBetOptions;
  }
  // Return valid pot percentage options filtered by minRaiseAmount and player's chips
  return filterValidOptions(potOptions);
}

return [];
};

// Helper function to calculate delay based on the number of cards and all-in scenario
export function calculateDelay(
index: number,
newCardsCount: number,
numberOfPreviousCommunityCards: number,
isAllInBeforeRiver: boolean,
gameState: GameState
): number {
const isNoBetBombPot = (gameState && gameState.bombPotActive && !gameState.bombPotSettings.postFlopBetting) ?? false;
const isRegularBomPot = (gameState && gameState.bombPotActive && gameState.bombPotSettings.postFlopBetting) ?? false;

if (isNoBetBombPot) {
  // Staggered delay for bomb pot reveals
  const adjustedIndex = index - numberOfPreviousCommunityCards;
  return 1.5 + adjustedIndex * 0.9; // Start after 1.5s and stagger each card by 0.3s
} else if (isRegularBomPot && gameState.gameStage === "flop") {
  const adjustedIndex = index - numberOfPreviousCommunityCards;
  return 1.8 + adjustedIndex * 0.7;
}

const isRevealingSingleCard = newCardsCount === 1;
const minimumDelay = 0.8; // 0.8 second delay to allow for last move and bet animations

if (isRevealingSingleCard) {
  return minimumDelay; // 0.8-second delay for a single card reveal
}

// Calculate the number of cards already shown (i.e., communityCards already visible)
const alreadyRevealedCards = numberOfPreviousCommunityCards;

// Subtract the number of already revealed cards from the current index to adjust for current reveal order
const adjustedIndex = index - alreadyRevealedCards;

// For multiple cards, ensure they are shown sequentially with at least a 1-second delay
// Each subsequent card gets delayed by 0.5s (or 1s if all-in), with the first card appearing after 1s
const calculatedDelay =
  minimumDelay + adjustedIndex * (isAllInBeforeRiver ? 1 : 0.5);

return calculatedDelay;
}

// Helper function to calculate duration based on the number of cards and all-in scenario
export function calculateDuration(
index: number,
newCardsCount: number,
isAllInBeforeRiver: boolean,
): number {
const isRevealingSingleCard = newCardsCount === 1;
if (isRevealingSingleCard) {
  return 0.5; // Shorter duration for a single card reveal
}
// Longer duration for multiple cards, especially in an all-in scenario
return isAllInBeforeRiver ? 1.6 : 0.5;
}

export const getAllPlayersBet = (players: (Player | null | undefined)[]) => {
  const total = players
    .filter((player): player is Player => player !== null && player !== undefined) // Filter out null or undefined players
    .reduce((total, player) => total + player.bet, 0);

  return total || 0; // Return 0 if total is falsy
};

export const calculateChipDistribution = (betValue: number) => {
const blackChips = Math.floor(betValue / 100);
const blueChips = Math.floor((betValue % 100) / 50);
const yellowChips = Math.floor((betValue % 50) / 10);
const redChips = betValue % 10;

return [
  { count: blackChips, image: require('@/assets/game/coin-black.png') as string, alt: "coinblack" },
  { count: blueChips, image: require('@/assets/game/coin-blue.png') as string, alt: "coinblue" },
  { count: yellowChips, image: require('@/assets/game/coin-yellow.png') as string, alt: "coinyellow" },
  { count: redChips, image: require('@/assets/game/coin-red.png') as string, alt: "coinred" },
];
};

export const formatChipsOrBB = (
amount: number,
displayBB: boolean,
bigBlind: number,
): string => {
if (displayBB) {
  const bbValue = amount / bigBlind;
  return `${parseFloat((bbValue * 100).toFixed(2))} BB`;
} else {
  const formattedChips = new Intl.NumberFormat("en-US").format(amount);
  return formattedChips;
}
};

export const playSound = (action: string, gameState: GameState, emote: string) => {
if (action === "playerCheck") {
  const playerCheckAudio = new Audio("/sounds/checkSound.mp3");

  playerCheckAudio.play().catch((error) => {
    console.error("Error playing checkSound sound:", error);
  });
} else if (action === "playerReady") {
  const playerReadyAudio = new Audio("/sounds/cardsDealt.mp3");

  playerReadyAudio.play().catch((error) => {
    console.error("Error playing checkSound sound:", error);
  });
} else if (action === "playerCall") {
  const playerCallAudio = new Audio("/sounds/callSound.mp3");

  playerCallAudio.play().catch((error) => {
    console.error("Error playing callSound sound:", error);
  });
} else if (action === "playerRaise") {
  const playerCallAudio = new Audio("/sounds/raiseSound.mp3");

  playerCallAudio.play().catch((error) => {
    console.error("Error playing raiseSound sound:", error);
  });
} else if (action === "playerFold") {
  const playerCallAudio = new Audio("/sounds/foldSound.mp3");

  playerCallAudio.play().catch((error) => {
    console.error("Error playing raiseSound sound:", error);
  });
} else if (action === "showEmote") {
  if (emote === "😩") {
    const daddyAudio = new Audio("/sounds/daddySound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing daddySound sound:", error);
    });
  } else if (emote === "🤣") {
    const daddyAudio = new Audio("/sounds/laughSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing laughSound sound:", error);
    });
  } else if (emote === "😡") {
    const daddyAudio = new Audio("/sounds/grrSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing grrSound sound:", error);
    });
  } else if (emote === "🤑") {
    const daddyAudio = new Audio("/sounds/moneySound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing moneySound sound:", error);
    });
  } else if (emote === "😁") {
    const daddyAudio = new Audio("/sounds/hihihihaSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing hihihihaSound sound:", error);
    });
  } else if (emote === "🥲") {
    const daddyAudio = new Audio("/sounds/sadSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing sadSound sound:", error);
    });
  } else if (emote === "🐥") {
    const daddyAudio = new Audio("/sounds/chickenSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing chickenSound sound:", error);
    });
  } else if (emote === "🤗") {
    const daddyAudio = new Audio("/sounds/ahahSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing ahahSound sound:", error);
    });
  } else if (emote === "😘") {
    const daddyAudio = new Audio("/sounds/kissesSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing kissesSound sound:", error);
    });
  } else if (emote === "🤡") {
    const daddyAudio = new Audio("/sounds/clownSound.mp3");

    daddyAudio.play().catch((error) => {
      console.error("Error playing clownSound sound:", error);
    });
  }
}
}

export const gameFinishedToWaitTime = {
preFlop: 10,
flop: 8,
turn: 6,
river: 5,
};