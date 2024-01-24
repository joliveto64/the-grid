import { MutableRefObject } from "react";

interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
  isUser: boolean;
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

function orderReadout(randomNum: number) {
  if (randomNum === 0) {
    return "→ ↓ ← ↑";
  } else if (randomNum === 1) {
    return "↓ ← ↑ → ";
  } else if (randomNum === 2) {
    return "← ↑ ↓ →";
  } else if (randomNum === 3) {
    return "→ ↑ ← ↓";
  }
}

function allowedToClick(
  touchedCells: MutableRefObject<Set<string>>,
  gridData: Grid,
  row: number,
  col: number
) {
  const up = `${row - 1},${col}`;
  const down = `${row + 1},${col}`;
  const right = `${row},${col + 1}`;
  const left = `${row},${col - 1}`;

  if (gridData[row][col].isDark) {
    return false;
  }

  if (
    touchedCells.current.has(down) ||
    touchedCells.current.has(right) ||
    touchedCells.current.has(up) ||
    touchedCells.current.has(left)
  ) {
    return true;
  }
  return false;
}

function gradeUser(grid: Grid) {
  let overlap = 0;
  let aiCount = 0;
  let userCount = -1;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c].isAi) {
        aiCount++;
      }
      if (grid[r][c].isUser) userCount++;
      if (grid[r][c].isUser && grid[r][c].isAi) overlap++;
    }
  }

  let ratio: number;
  if (userCount === aiCount && userCount === overlap) {
    ratio = 1;
  } else if (aiCount > userCount) {
    ratio = overlap / aiCount;
  } else {
    ratio = overlap / userCount;
  }

  return (ratio * 100).toFixed(1) + "%";
}

export { PreventOpenSpace, orderReadout, allowedToClick, gradeUser };
