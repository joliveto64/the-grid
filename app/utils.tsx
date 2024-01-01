interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
}
type Grid = Cell[][];

function PreventOpenSpace(row: number, col: number, grid: Grid) {
  let up;
  let down;
  let right;
  let left;
  let upRight;
  let upLeft;
  let downLeft;
  let downRight;

  if (row > 0) up = grid[row - 1][col];
  if (row < grid.length - 1) down = grid[row + 1][col];
  if (col > 0) left = grid[row][col - 1];
  if (col < grid[0].length - 1) right = grid[row][col + 1];
  if (row > 0 && col < grid[0].length - 1) upRight = grid[row - 1][col + 1];
  if (row < grid.length - 1 && col < grid[0].length - 1)
    downRight = grid[row + 1][col + 1];
  if (row < grid.length - 1 && col > 0) downLeft = grid[row + 1][col - 1];
  if (row > 0 && col > 0) upLeft = grid[row - 1][col - 1];

  if (
    up &&
    !up.isDark &&
    right &&
    !right.isDark &&
    upRight &&
    !upRight.isDark
  ) {
    return true;
  }

  if (up && !up.isDark && left && !left.isDark && upLeft && !upLeft.isDark) {
    return true;
  }

  if (
    down &&
    !down.isDark &&
    left &&
    !left.isDark &&
    downLeft &&
    !downLeft.isDark
  ) {
    return true;
  }

  if (
    down &&
    !down.isDark &&
    right &&
    !right.isDark &&
    downRight &&
    !downRight.isDark
  ) {
    return true;
  }

  return false;
}

function countCells(grid: Grid) {
  let count = 0;

  for (let row of grid) {
    for (let cell of row) {
      if (!cell.isDark) {
        console.log(cell);
        count++;
      }
    }
  }

  return count;
}

export { PreventOpenSpace, countCells };
