import { useState, useRef } from "react";
import { createGrid } from "../createMaze";

export default function useSharedState() {
  const [gridSize, setGridSize] = useState(15);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize));
  const [aiMoving, setAiMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchedCells = useRef<Set<string>>(new Set());

  return {
    gridData,
    setGridData,
    aiMoving,
    setAiMoving,
    isDragging,
    setIsDragging,
    gridSize,
    setGridSize,
    touchedCells,
  };
}
