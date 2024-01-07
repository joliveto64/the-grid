import { useState } from "react";
import { createGrid } from "../createMaze";

export default function useSharedState() {
  const [gridSize, setGridSize] = useState(20);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize));
  const [aiMoving, setAiMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return {
    gridData,
    setGridData,
    aiMoving,
    setAiMoving,
    isDragging,
    setIsDragging,
    gridSize,
    setGridSize,
  };
}
