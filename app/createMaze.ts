import { exploreMaze } from "./pathfinding";
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
      if (!PreventOpenSpace(r, c, grid) && randomNum > 0.4) {
        grid[r][c] = { ...grid[r][c], isDark: false };
      }
    }
  }

  return grid;
}

function createMaze(numMazes: number, rows: number, cols: number) {
  let gridArray = [];
  for (let i = 0; i < numMazes; i++) {
    gridArray.push(createGrid(rows, cols));
  }

  for (let i = 0; i < gridArray.length; i++) {
    console.log("running");
    fillGrid(gridArray[i]);
  }

  let validMazes = [];
  for (let i = 0; i < gridArray.length; i++) {
    if (exploreMaze(gridArray[i])) {
      validMazes.push(gridArray[i]);
    }
  }

  return gridArray;
}

let arrayOfGrids = createMaze(1, 5, 5);
export { createGrid, arrayOfGrids };
