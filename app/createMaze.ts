import { exploreMaze } from "./pathfinding";
import { PreventOpenSpace } from "./utils";

type Grid = {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
  isUser: boolean;
}[][];

function createGrid(rows: number, columns: number, rand: number) {
  let dir = getDirection(rows, rand);
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let column = 0; column < columns; column++) {
      if (row === dir.startRow && column === dir.startCol) {
        currentRow.push({
          isDark: false,
          isStart: true,
          isEnd: false,
          isAi: false,
          isUser: true,
        });
      } else if (row === dir.endRow && column === dir.endCol) {
        currentRow.push({
          isDark: false,
          isStart: false,
          isEnd: true,
          isAi: false,
          isUser: false,
        });
      } else {
        currentRow.push({
          isDark: true,
          isStart: false,
          isEnd: false,
          isAi: false,
          isUser: false,
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

function createMaze(rows: number, cols: number, randomNum: number) {
  let validMazes = [];
  while (validMazes.length < 1) {
    let currentMaze = fillGrid(createGrid(rows, cols, randomNum));

    if (exploreMaze(currentMaze)?.hasPath) {
      validMazes.push(currentMaze);
    }
  }

  return validMazes[0];
}

function getDirection(gridSize: number, randomNum: number) {
  if (randomNum === 0) {
    return {
      dir: "BR",
      startRow: 0,
      startCol: 0,
      endRow: gridSize - 1,
      endCol: gridSize - 1,
    };
  } else if (randomNum === 1) {
    return {
      dir: "BL",
      startRow: 0,
      startCol: gridSize - 1,
      endRow: gridSize - 1,
      endCol: 0,
    };
  } else if (randomNum === 2) {
    return {
      dir: "TL",
      startRow: gridSize - 1,
      startCol: gridSize - 1,
      endRow: 0,
      endCol: 0,
    };
  } else {
    return {
      dir: "TR",
      startRow: gridSize - 1,
      startCol: 0,
      endRow: 0,
      endCol: gridSize - 1,
    };
  }
}

export { createGrid, createMaze };
