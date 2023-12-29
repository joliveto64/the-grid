interface Cell {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
}

type Grid = Cell[][];

// fath finding algorithm for maze
function exploreMaze(grid: Grid) {
  if (!grid) return;

  // let visited = new Set<string>();
  let hasPath;

  // loop over to find starting cell
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].isStart === true) {
        // call finPath from starting cell
        hasPath = findPaths(grid, r, c);
      }
    }
  }
  console.log(hasPath);
  return hasPath;
}

// exploreMaze(grid);

function findPaths(grid: Grid, startRow: number, startCol: number) {
  let stack = [
    { row: startRow, col: startCol, cell: grid[startRow][startCol] },
  ];
  let visited = new Set();

  while (stack.length > 0) {
    let { row, col, cell } = stack.pop()!;

    console.log(row, col);
    if (cell.isEnd) return true;
    let pos = row + "," + col;
    visited.add(pos);

    if (row < grid.length - 1) {
      let down = grid[row + 1][col];
      if (!down.isDark && !visited.has(row + 1 + "," + col)) {
        stack.push({ row: row + 1, col: col, cell: down });
      }
    }

    if (row > 0) {
      let up = grid[row - 1][col];
      if (!up.isDark && !visited.has(row - 1 + "," + col)) {
        stack.push({ row: row - 1, col: col, cell: up });
      }
    }

    if (col < grid[0].length - 1) {
      let right = grid[row][col + 1];
      if (!right.isDark && !visited.has(row + "," + (col + 1))) {
        stack.push({ row: row, col: col + 1, cell: right });
      }
    }

    if (col > 0) {
      let left = grid[row][col - 1];
      if (!left.isDark && !visited.has(row + "," + (col - 1))) {
        stack.push({ row: row, col: col - 1, cell: left });
      }
    }
  }

  return false;
}

export { exploreMaze };
