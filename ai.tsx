interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
}

type Grid = Cell[][];

let grid = [
  [
    { isDark: true, isStart: true, isEnd: false },
    { isDark: false, isStart: false, isEnd: false },
    { isDark: false, isStart: false, isEnd: false },
    { isDark: true, isStart: false, isEnd: false },
  ],
  [
    { isDark: false, isStart: false, isEnd: false },
    { isDark: false, isStart: false, isEnd: false },
    { isDark: false, isStart: false, isEnd: false },
    { isDark: true, isStart: false, isEnd: false },
  ],
  [
    { isDark: true, isStart: false, isEnd: false },
    { isDark: true, isStart: false, isEnd: false },
    { isDark: false, isStart: false, isEnd: false },
    { isDark: false, isStart: false, isEnd: true },
  ],
];

// fath finding algorithm for maze
function exploreMaze(grid: Grid) {
  if (!grid) return;

  let visited = new Set<string>();
  let hasPath = false;
  let end;

  // loop over to find starting cell
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].isStart === true) {
        // call finPath from starting cell
        end = findPath(grid, r, c, visited);
      }
    }
  }
  return end;
}

function findPath(
  grid: Grid,
  r: number,
  c: number,
  visited: Set<string>
): string | number {
  // Corrected boundary checks
  if (r < 0 || r >= grid.length) return -1;
  if (c < 0 || c >= grid[0].length) return -1;
  if (grid[r][c].isDark && !grid[r][c].isStart && !grid[r][c].isEnd) return -1;

  let position = r + "," + c;
  if (visited.has(position)) return -1; // Visited check
  visited.add(position); // Mark as visited

  // Uncommented and corrected the successful termination condition
  if (grid[r][c].isEnd) {
    console.log(position);
    return position;
  }

  console.log(position);

  // Make recursive calls and handle the returns to prevent infinite loops
  let random = Math.random() > 0.5;
  let res;

  res = findPath(grid, r + 1, c, visited);
  if (res !== -1) return res;

  res = findPath(grid, r - 1, c, visited);
  if (res !== -1) return res;

  res = findPath(grid, r, c + 1, visited);
  if (res !== -1) return res;

  res = findPath(grid, r, c - 1, visited);
  if (res !== -1) return res;

  // If none of the recursive calls find the end, we backtrack, removing the current position
  // from the visited set to allow different paths to reuse this cell.
  visited.delete(position);

  // If no path is found, return -1
  return -1;
}

// exploreMaze(grid);
export { exploreMaze };
