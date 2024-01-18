import { useState, useRef, useEffect } from "react";
import { createGrid } from "../createMaze";
import { supabase } from "../supabaseClient";

export default function useSharedState() {
  const [tempGridSize, setTempGridSize] = useState(10);
  const [gridSize, setGridSize] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const stopAi = useRef<boolean>(false);
  const touchedCells = useRef<Set<string>>(new Set());
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize, 0));
  const [aiDone, setAiDone] = useState(false);
  const [userScore, setUserScore] = useState<string | number>("");
  const [numMazes, setNumMazes] = useState<number | undefined>();
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const randomNum = useRef<number>(0);
  const [scale, setScale] = useState(1.0);
  const [isCoolDown, setIsCoolDown] = useState(false);

  return {
    gridData,
    setGridData,
    stopAi,
    gridSize,
    setGridSize,
    touchedCells,
    tempGridSize,
    setTempGridSize,
    aiDone,
    setAiDone,
    userScore,
    setUserScore,
    numMazes,
    setNumMazes,
    showHowToPlay,
    setShowHowToPlay,
    randomNum,
    isDragging,
    setIsDragging,
    scale,
    setScale,
    isCoolDown,
    setIsCoolDown,
  };
}
