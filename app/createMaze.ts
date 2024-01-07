import { exploreMaze, gridSize } from "./pathfinding";
import { PreventOpenSpace } from "./utils";

interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
}
type Grid = Cell[][];

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
      } else if (row === rows - 1 && column === columns - 1) {
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

function fillGrid(grid: Grid): Grid {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      let randomNum = Math.random();
      if (!PreventOpenSpace(r, c, grid) && randomNum > 0.3) {
        grid[r][c] = { ...grid[r][c], isDark: false };
      }
    }
  }

  return grid;
}

function createMaze(rows: number, cols: number) {
  let validMazes = [];
  while (validMazes.length < 1) {
    let currentMaze = fillGrid(createGrid(rows, cols));

    if (exploreMaze(currentMaze, gridSize)?.hasPath) {
      validMazes.push(currentMaze);
    }
  }

  return validMazes[0];
}

export { createGrid, createMaze };
