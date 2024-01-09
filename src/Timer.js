import React, { useState, useContext, useEffect, useRef } from "react";
import "./Timer.css";
import SettingsContext from "./Setting/SettingsContext";
import PlayButton from "./Button/PlayButton";
import PauseButton from "./Button/PauseButton";
import SettingsButton from "./Setting/SettingsButton";
import ResetButton from "./Button/ResetButton";
import TodoList from "./TodoList";
import AddText from "./AddText";

const studyColor = "#FF8000";
const breakColor = "#FF8000";

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#4C5454");

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  useEffect(() => {
    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work"
          ? settingsInfo.workMinutes
          : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    function tick() {
      secondsLeftRef.current--;
      setSecondsLeft(secondsLeftRef.current);
    }

    const initialSeconds =
      (settingsInfo.workMinutes > 0 ? settingsInfo.workMinutes : 25) * 60;
    setSecondsLeft(initialSeconds);
    secondsLeftRef.current = initialSeconds;

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds =
    mode === "work"
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  const handleReset = () => {
    setIsPaused(true);
    isPausedRef.current = true;
    setMode("work");
    modeRef.current = "work";
    setSecondsLeft(settingsInfo.workMinutes * 60);
    secondsLeftRef.current = settingsInfo.workMinutes * 60;

    setBackgroundColor("#4C5454");
  };

  const handleStart = () => {
    setBackgroundColor("#183A37");

    setIsPaused(false);
    isPausedRef.current = false;
  };

  return (
    <div>
      {/* Include AddText component at the top */}
      <AddText />
      <style>{`
        body {
          background-color: ${backgroundColor};
          transition: background-color 0.5s;
          margin: 0; 
        }
      `}</style>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: mode === "work" ? studyColor : breakColor,
          }}
        ></div>
      </div>

      <div className="timer-text">
        {minutes}:{seconds}
      </div>

      <div className="timer-buttons">
        <ResetButton onClick={handleReset} />
        {isPaused ? (
          <PlayButton
            onClick={() => {
              handleStart();
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
        <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
      </div>
      <TodoList />
    </div>
  );
}

export default Timer;
