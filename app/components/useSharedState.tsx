import { useState, useRef } from "react";
import { createGrid } from "../createMaze";

export default function useSharedState() {
  const [tempGridSize, setTempGridSize] = useState(10);
  const [gridSize, setGridSize] = useState(10);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize));
  const [isDragging, setIsDragging] = useState(false);
  const stopAi = useRef<boolean>(false);
  const touchedCells = useRef<Set<string>>(new Set());
  const [pathRightFirst, setPathRightFirst] = useState(true);
  const [aiDone, setAiDone] = useState(false);
  const [userScore, setUserScore] = useState<string | number>("");

  return {
    gridData,
    setGridData,
    stopAi,
    gridSize,
    setGridSize,
    touchedCells,
    pathRightFirst,
    setPathRightFirst,
    tempGridSize,
    setTempGridSize,
    aiDone,
    setAiDone,
    userScore,
    setUserScore,
  };
}
