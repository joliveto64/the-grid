import { useState, useRef } from "react";
import { createGrid } from "../createMaze";

export default function useSharedState() {
  const [tempGridSize, setTempGridSize] = useState(10);
  const [gridSize, setGridSize] = useState(10);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize));
  const [isDragging, setIsDragging] = useState(false);
  const stopAi = useRef<boolean>(false);
  const lastTouchEnd = useRef<number>(0);
  const touchedCells = useRef<Set<string>>(new Set());
  const [pathRightFirst, setPathRightFirst] = useState(true);
  const [userDone, setUserDone] = useState(false);

  return {
    gridData,
    setGridData,
    stopAi,
    isDragging,
    setIsDragging,
    gridSize,
    setGridSize,
    touchedCells,
    lastTouchEnd,
    pathRightFirst,
    setPathRightFirst,
    tempGridSize,
    setTempGridSize,
  };
}
