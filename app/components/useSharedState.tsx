import { useState } from "react";
import { createGrid } from "../createMaze";

export default function useSharedState() {
  const numCells = 8;
  const [gridData, setGridData] = useState(createGrid(numCells, numCells));
  const [aiMoving, setAiMoving] = useState(false);

  return {
    numCells,
    gridData,
    setGridData,
    aiMoving,
    setAiMoving,
  };
}
