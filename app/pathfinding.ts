type Cell = {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
};
type Grid = Cell[][];

function exploreMaze(grid: Grid, switchOrder: boolean) {
  if (!grid) return;
  let startPos: [number, number] = [0, 0];

  let returnObject;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].isStart === true) {
        startPos = [r, c];
      }
    }
  }

  returnObject = findPaths(grid, startPos, switchOrder);
  return returnObject;
}

function findPaths(
  grid: Grid,
  startPos: [number, number],
  switchOrder: boolean
) {
  let visited: Set<string> = new Set();
  let stack = [{ row: startPos[0], col: startPos[1] }];

  while (stack.length > 0) {
    let { row, col } = stack.pop()!;

    if (grid[row][col].isEnd) {
      let finalPath = convertCoords(visited);
      return { hasPath: true, path: finalPath };
    }

    visited.add(row + "," + col);

    if (switchOrder) {
      if (row > 0) {
        let up = grid[row - 1][col];
        if (!up.isDark && !visited.has(row - 1 + "," + col)) {
          stack.push({ row: row - 1, col: col });
        }
      }

      if (col > 0) {
        let left = grid[row][col - 1];
        if (!left.isDark && !visited.has(row + "," + (col - 1))) {
          stack.push({ row: row, col: col - 1 });
        }
      }

      if (row < grid.length - 1) {
        let down = grid[row + 1][col];
        if (!down.isDark && !visited.has(row + 1 + "," + col)) {
          stack.push({ row: row + 1, col: col });
        }
      }

      if (col < grid[0].length - 1) {
        let right = grid[row][col + 1];
        if (!right.isDark && !visited.has(row + "," + (col + 1))) {
          stack.push({ row: row, col: col + 1 });
        }
      }
    } else {
      if (col > 0) {
        let left = grid[row][col - 1];
        if (!left.isDark && !visited.has(row + "," + (col - 1))) {
          stack.push({ row: row, col: col - 1 });
        }
      }

      if (row > 0) {
        let up = grid[row - 1][col];
        if (!up.isDark && !visited.has(row - 1 + "," + col)) {
          stack.push({ row: row - 1, col: col });
        }
      }

      if (col < grid[0].length - 1) {
        let right = grid[row][col + 1];
        if (!right.isDark && !visited.has(row + "," + (col + 1))) {
          stack.push({ row: row, col: col + 1 });
        }
      }

      if (row < grid.length - 1) {
        let down = grid[row + 1][col];
        if (!down.isDark && !visited.has(row + 1 + "," + col)) {
          stack.push({ row: row + 1, col: col });
        }
      }
    }
  }

  let finalPath = convertCoords(visited);
  return { hasPath: false, path: finalPath };
}

function convertCoords(visitedSet: Set<string>) {
  let pathArray: string[] = [...visitedSet];
  let tuplesArray: [number, number][] = [];

  for (let i = 1; i < pathArray.length; i++) {
    let [x, y] = pathArray[i].split(",");

    tuplesArray.push([Number(x), Number(y)]);
  }

  return tuplesArray;
}

export { exploreMaze };
