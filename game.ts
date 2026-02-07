export type GameState = {
  day: number
  health: number
  scene: string
  money: number
  spread: number
  maxDays: number
  isGameOver: boolean
  ending?: EndingType
  endingLoc?: string
  gameStarted: boolean

}

export const initialGameState: GameState = {
  day: 1,
  health: 80,
  money: 50,
  scene: "bedroom",
  spread: 0,
  maxDays: 3,
  isGameOver: false,
  gameStarted: false
}

export type EndingType =
  | "survived"
  | "broke"
  | "hospitalized"

export const THRESHOLDS = {
  minHealth: 0,
  minMoney: 0
}
// since each choice user makes doesn't effect each state make each stat optional with the '?'
export type Effects = {
  health?: number
  money?: number
  spread?: number
}
// takes the current game state and the set effects and return a new game state
export function applyEffects(
  state: GameState,
  effects: Effects
): GameState {
  return {
    ...state,
    health: state.health + (effects.health ?? 0),
    money: state.money + (effects.money ?? 0),
    spread: state.spread + (effects.spread ?? 0)
  }
}
// function that goes to next day
export function nextDay(state: GameState): GameState {
  return {
    ...state,
    day: state.day + 1
  }
}
// function that gets the next scene/question
export function nextScene(state: GameState): GameState {
  return {
    ...state,
    scene: state.scene + 1
  }
}

export function resetSceneAndNextDay(state: GameState): GameState {
  return {
    ...state,
    day: state.day + 1,
    scene: "bedroom"
  }
}

// gives the result of the game 
// if the current health is less than the min health threshold then user is hospitalized
// if the cuurent money is less that the min money threshold then user is broke
// if the current amont of days exceeds the max days threshold then user survived
export function checkGameOver(state: GameState): GameState {
  if (state.health <= THRESHOLDS.minHealth) {
    return { ...state, isGameOver: true, ending: "hospitalized" , endingLoc:"blank"}
  }

  if (state.money <= THRESHOLDS.minMoney) {
    return { ...state, isGameOver: true, ending: "broke" , endingLoc:"blank"}
  }

  if (state.day > state.maxDays) {
    return { ...state, isGameOver: true, ending: "survived" , endingLoc:"blank"}
  }

  return state
}
