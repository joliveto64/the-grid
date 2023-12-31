interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
}
type Grid = Cell[][];

function detectOpenSpace(row: number, col: number, grid: Grid) {
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
    console.log("open-area top right");
  }

  if (up && !up.isDark && left && !left.isDark && upLeft && !upLeft.isDark) {
    console.log("open-area top left");
  }

  if (
    down &&
    !down.isDark &&
    left &&
    !left.isDark &&
    downLeft &&
    !downLeft.isDark
  ) {
    console.log("open-area bottom left");
  }

  if (
    down &&
    !down.isDark &&
    right &&
    !right.isDark &&
    downRight &&
    !downRight.isDark
  ) {
    console.log("open-area bottom right");
  }
}

export { detectOpenSpace };
