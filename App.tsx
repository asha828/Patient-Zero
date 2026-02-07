// src/App.tsx
import {useState, useEffect} from "react"
import './App.css';
import {
  initialGameState,
  applyEffects,
  nextScene,
  resetSceneAndNextDay,
  checkGameOver,
  GameState
} from "./game"
import { CHOICES_BY_DAY, Scene, Choice } from "./choices"
// import background images
import day0 from "./backgroundAssets/day0.png";
import busstop from "./backgroundAssets/busstop.png";
import bedroom from "./backgroundAssets/bedroom.png";
import birthday from "./backgroundAssets/birthdayparty.png";
import classroom from "./backgroundAssets/classroom.png";
import grocery from "./backgroundAssets/grocery.png";
import hospital from "./backgroundAssets/hospital.png";
import work from "./backgroundAssets/work.png";
import pharmacy from "./backgroundAssets/pharmacy.png";

import opening from "./backgroundAssets/opening.png";
import blank from "./backgroundAssets/BLANK_closing.png";
import about from "./backgroundAssets/about.png";
//import { applyEffectsWithLocation } from "./gameLogic"

// inside handleChoice

const getSceneBackground = (bg?: string) => {
  switch (bg) {
    case "day0": return day0
    case "busstop": return busstop
    case "bedroom": return bedroom
    case "birthday": return birthday
    case "classroom": return classroom
    case "grocery": return grocery
    case "hospital": return hospital
    case "work": return work
    case "pharmacy": return pharmacy
    case "opening": return opening
    case "blank": return blank
    case "about": return about
    default: return bedroom
  }
}

// this function takes in the current game state and retunrs a new scene or null if no scene exists
// each scene comes from choices.ts
function getCurrentScene(state: GameState): Scene | null {
  // determine the current day (get the array of scenes for the current day)
  const scenesForDay = CHOICES_BY_DAY[state.day]
  if (!scenesForDay) return null
  return scenesForDay.find(scene => scene.id === state.scene) || null
}

// App() is the React component that starts the game
export default function App() {
  // creates a React state and takes in the current state(state) and the function to update the new state (setState)
  const [state, setState] = useState<GameState>(initialGameState)
   // to check if scene should fade
  const [isFading, setIsFading] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [showChoices, setShowChoices] = useState(false)
  const [buttonOpacity, setButtonOpacity] = useState(0)
  //const [gameStarted, setGameStarted] = useState(false)
  // calls getCurrentScene and passes in the state to get the current scene 
  const scene = getCurrentScene(state)
  // if no scene exists then output this
  
useEffect(() => {
  if (!scene) return;

  setDisplayedText("");
  setShowChoices(false);
  setButtonOpacity(0);

  let index = 0;
  const interval = setInterval(() => {
    setDisplayedText(scene.prompt.slice(0, index + 1));
    index++;
    if (index >= scene.prompt.length) {
      clearInterval(interval);
      setShowChoices(true);
      setTimeout(() => setButtonOpacity(1), 50);
    }
  }, 30);

  return () => clearInterval(interval);
}, [scene?.id]); // <-- changed from scene.prompt to scene.id


  if (!scene && state.gameStarted) return <p>Loading...</p>
const handleChoice = (choice: Choice) => {
  setIsFading(true);

  setTimeout(() => {
    let newState = applyEffects(state, choice.effects);

    const scenesForDay = CHOICES_BY_DAY[state.day];
    if (!scenesForDay) {
      console.error("No scenes for day", state.day);
      setIsFading(false);
      return;
    }

    let nextSceneId: string;
    if (choice.nextScene) {
      nextSceneId = choice.nextScene;
    } else {
      const currentIndex = scenesForDay.findIndex(scene => scene.id === state.scene);
      if (currentIndex >= scenesForDay.length - 1) {
        newState = resetSceneAndNextDay(newState);
        const nextDayScenes = CHOICES_BY_DAY[newState.day];
        if (nextDayScenes && nextDayScenes.length > 0) {
          nextSceneId = nextDayScenes[0].id;
        } else {
          setState({ ...newState, isGameOver: true });
          setIsFading(false);
          return;
        }
      } else {
        nextSceneId = scenesForDay[currentIndex + 1].id;
      }
    }

    newState = { ...newState, scene: nextSceneId };
    setState(checkGameOver(newState));
    setIsFading(false);
  }, 400);
};



  // Start game: sets initial day & scene
const startGame = () => {
  setState({
    ...state,
    gameStarted: true,
    day: 1,
    scene: "opening_day1"
  });
};





    
  return (
  <div
    className="max-w-xl mx-auto p-4 text-center"
    style={{
      backgroundImage: `url(${
  !state.gameStarted
    ? getSceneBackground("opening")
    : state.isGameOver && state.endingLoc
      ? getSceneBackground(state.endingLoc)
      : getSceneBackground(scene?.background)
})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top center",
      minHeight: "100vh",
      position: "relative"
    }}
  >
    <h1 style= {{ padding: "25px" }}> Patient-Zero</h1>
  {/* 🎮 START SCREEN */}

  {!state.gameStarted && (
  <div
    style={{ 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh"
    }}
    >
      <div
      style= {{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        borderRadius: 20,
        padding: 30,
        width: 420,
        color: "white",
        boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
    <h2 className="text-4xl mb-8 pixel-text">Patient Zero</h2>

    <button
      onClick={startGame}
      style={{
        minWidth: 260,
        minHeight: 60,
        fontSize: 20,
        borderRadius: 20,
        fontFamily: 'MyFont, sans-serif'
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
    >
      Start Game
    </button>
    </div>
  </div>
)}

  {state.gameStarted && (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        color: "white",
        fontSize: 15,
        textAlign: "right",
        width: 100
      }}
    >

  {/* METERS */}
    <div style ={{ marginBottom: 10}}>
        <p> Health: {state.health}</p>
        <div style={{ width: "100%", backgroundColor: "#444", height: 8, borderRadius: 4}}>
          <div
            style={{
              width: `${state.health}%`,
              backgroundColor: "#FFFFFF",
              height: 8,
              borderRadius: 4
              
            }}
          ></div>
        </div>
      </div> 

      <div style ={{ marginBottom: 10}}>
        <p> Money: {Math.max(0, state.money)}</p>
        <div style={{ width: "100%", backgroundColor: "#444", height: 8, borderRadius: 4}}>
          <div
            style={{
              width: `${Math.max(0, state.money)}%`,
              backgroundColor: "#FFFFFF",
              height: 8,
              borderRadius: 4
            }}
          ></div>
        </div>
      </div>
    </div>
    )}


    {/* 🌫️ CENTER POPUP */}
    
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          borderRadius: 20,
          padding: 30,
          width: 420,
          color: "white",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {state.gameStarted && !state.isGameOver && (
          <>
            <h2 className="text-xl mb-2">Day {state.day}</h2>
            <p className="mb-6 text-xl leading-relaxed">{displayedText}</p>

            {/* inside App.tsx, in your JSX*/}
          {showChoices && (
            <div
              className="flex flex-col items-center gap-6 mb-4"
              style={{
                opacity: buttonOpacity,
                transition: "opacity 0.5s ease" //
              }}
            >
              {scene?.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  style={{
                    minHeight: 60,        // set fixed height
                    minWidth: 300,        // set fixed width
                    fontSize: 18,         // slightly larger text
                    fontFamily: 'MyFont, sans-serif', // font
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          </>
        )}
        {state.gameStarted && state.isGameOver && (
          <div className="text-2xl font-bold mb-2">
      
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p>Ending: {state.ending}</p>
            <p className="mt-2">Refresh the page to play again.</p>
          </div>
        )}
      </div>
    </div>

    {/* Fade overlay (unchanged) */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        opacity: isFading ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.4s ease"
      }}
    />
  </div>
)
}
