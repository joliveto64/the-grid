interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
}
type Grid = Cell[][];

function exploreMaze(grid: Grid) {
  if (!grid) return;

  let hasPath;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].isStart === true) {
        hasPath = findPaths(grid, r, c);
      }
    }
  }

  return hasPath;
}

function findPaths(grid: Grid, startRow: number, startCol: number) {
  let visited: Set<string> = new Set();
  let finalPath: [number, number][];
  let stack = [
    { row: startRow, col: startCol, cell: grid[startRow][startCol] },
  ];

  while (stack.length > 0) {
    let { row, col, cell } = stack.pop()!;

    if (cell.isEnd) {
      finalPath = convertCoords(visited);
      return { hasPath: true, path: finalPath };
    }

    visited.add(row + "," + col);

    if (row > 0) {
      let up = grid[row - 1][col];
      if (!up.isDark && !visited.has(row - 1 + "," + col)) {
        stack.push({ row: row - 1, col: col, cell: up });
      }
    }

    if (col > 0) {
      let left = grid[row][col - 1];
      if (!left.isDark && !visited.has(row + "," + (col - 1))) {
        stack.push({ row: row, col: col - 1, cell: left });
      }
    }

    if (row < grid.length - 1) {
      let down = grid[row + 1][col];
      if (!down.isDark && !visited.has(row + 1 + "," + col)) {
        stack.push({ row: row + 1, col: col, cell: down });
      }
    }

    if (col < grid[0].length - 1) {
      let right = grid[row][col + 1];
      if (!right.isDark && !visited.has(row + "," + (col + 1))) {
        stack.push({ row: row, col: col + 1, cell: right });
      }
    }
  }

  alert("Path must connect the green and red squares");
  finalPath = convertCoords(visited);
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
