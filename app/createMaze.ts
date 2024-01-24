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
      // set % chance for cell becoming a path
      if (!PreventOpenSpace(r, c, grid) && randomNum > 0.4) {
        grid[r][c] = { ...grid[r][c], isDark: false };
      }
    }
  }

  return grid;
}

function createMaze(rows: number, cols: number, randomNum: number) {
  let validMazes = [];
  let count = 0;
  // take first valid maze, stop at 1000 attempts / use placeholder
  while (validMazes.length < 1 && count < 1000) {
    count++;
    let currentMaze = fillGrid(createGrid(rows, cols, randomNum));

    if (exploreMaze(currentMaze)?.hasPath) {
      validMazes.push(currentMaze);
    }
  }

  if (validMazes[0]) {
    return validMazes[0];
  } else {
    console.log("Generative threshold exceeded");
    return createPlaceholder(rows, cols);
  }
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

function createPlaceholder(rows: number, cols: number) {
  let placeholder: Grid = [];
  for (let r = 0; r < rows; r++) {
    placeholder.push([]);
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c === 0) {
        placeholder[r].push({
          isDark: false,
          isStart: true,
          isEnd: false,
          isAi: false,
          isUser: false,
        });
      } else if (r === rows - 1 && c === cols - 1) {
        placeholder[r].push({
          isDark: false,
          isStart: false,
          isEnd: true,
          isAi: false,
          isUser: false,
        });
      } else {
        placeholder[r].push({
          isDark: false,
          isStart: false,
          isEnd: false,
          isAi: false,
          isUser: false,
        });
      }
    }
  }
  return placeholder;
}


export { createGrid, createMaze };
