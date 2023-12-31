import { useState } from "react";

export default function useSharedState() {
  const [numCells, setNumCells] = useState(8);
  const [gridData, setGridData] = useState(createGrid(numCells, numCells));
  const [aiMoving, setAiMoving] = useState(false);

  function createGrid(rows: number, columns: number) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let column = 0; column < columns; column++) {
        if (row === 0 && column === 0) {
          currentRow.push({
            isDark: false,
            isStart: true,
            isEnd: false,
            isAi: false,
          });
        } else if (row === numCells - 1 && column === numCells - 1) {
          currentRow.push({
            isDark: false,
            isStart: false,
            isEnd: true,
            isAi: false,
          });
        } else {
          currentRow.push({
            isDark: true,
            isStart: false,
            isEnd: false,
            isAi: false,
          });
        }
      }
      grid.push(currentRow);
    }

    // output: [[{}],[{}],[{}]]
    return grid;
  }

  return {
    numCells,
    setNumCells,
    gridData,
    setGridData,
    aiMoving,
    setAiMoving,
  };
}
