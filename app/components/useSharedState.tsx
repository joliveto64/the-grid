import { useState, useRef } from "react";
import { createGrid } from "../createMaze";

export default function useSharedState() {
  const [gridSize, setGridSize] = useState(20);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize));
  const [isDragging, setIsDragging] = useState(false);
  const stopAi = useRef<boolean>(false);
  const touchedCells = useRef<Set<string>>(new Set());

  return {
    gridData,
    setGridData,
    stopAi,
    isDragging,
    setIsDragging,
    gridSize,
    setGridSize,
    touchedCells,
  };
}
