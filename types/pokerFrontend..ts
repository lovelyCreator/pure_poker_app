import { type GameState } from "./poker";

export interface BaseAction {
  action: string;
  gameDetails: GameState;
}

export interface UpdateGameState extends BaseAction {
  action: "updateGameState";
}

export interface CreateGame extends BaseAction {
  action: "createGame";
  message: string;
  gameId: string;
  statusCode: number;
}

export interface JoinGame extends BaseAction {
  playerWhoJoined: string;
  action: "joinGame" | "joinGamePlayer";
  statusCode: number;
  message: string;
}

// The original type definition for this was incorrect. The server
// has never provided gameDetails.
export interface LeaveGame extends BaseAction {
  action: "leaveGame";
  statusCode: number;
}

export interface LeaveGamePlayer extends BaseAction {
  action: "leaveGamePlayer";
  statusCode: number;
}

export interface PlayerCall extends BaseAction {
  action: "playerCall";
}

export interface PlayerCheck extends BaseAction {
  action: "playerCheck";
}

export interface PlayerFold extends BaseAction {
  action: "playerFold";
}

export interface PlayerRaise extends BaseAction {
  action: "playerRaise";
}

export interface PlayerReady extends BaseAction {
  action: "playerReady";
}

export interface WaitingForNextGame extends BaseAction {
  action: "waitingForNextGame";
}
export interface BuyBackIn extends BaseAction {
  action: "buyBackIn";
  statusCode: number;
  message: string;
}
export interface BuyMoreChips extends BaseAction {
  action: "buyMoreChips";
  statusCode: number;
  message: string;
}

export interface ShowCards extends BaseAction {
  action: "showCards";
}

export interface ShowEmote extends BaseAction {
  action: "showEmote";
  message: {playerId: string, emote: string};
}

export interface addTime extends BaseAction {
  action: "addTime";
}

export interface BadRequest extends BaseAction {
  action: "badRequest";
  message: string;
}

export interface CreateBombPot extends BaseAction {
  action: "createBombPot";
}

export type PokerActionsFrontend =
  | UpdateGameState
  | CreateGame
  | JoinGame
  | LeaveGame
  | LeaveGamePlayer
  | PlayerCall
  | PlayerCheck
  | PlayerFold
  | PlayerRaise
  | PlayerReady
  | WaitingForNextGame
  | BuyBackIn
  | BuyMoreChips
  | ShowCards
  | BadRequest
  | ShowEmote
  | addTime
  | CreateBombPot;

export interface PokerWebSocketMessage {
  action: string,
  message: string,
  statusCode: number,
  gameDetails: GameState,
}