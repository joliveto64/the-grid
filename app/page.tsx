"use client";
import Cell from "./components/Cell";
import useSharedState from "./components/useSharedState";
import { PreventOpenSpace } from "./utils";

// TODO: make walls thinner

export default function Home() {
  const {
    numCells,
    setNumCells,
    gridData,
    setGridData,
    aiMoving,
    setAiMoving,
  } = useSharedState();

  // update state on cells to change color
  function handleCellClick(rowIndex: number, columnIndex: number) {
    if (PreventOpenSpace(rowIndex, columnIndex, gridData)) {
      return;
    }

    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((cell, cIndex) => {
            if (cIndex === columnIndex) {
              return { ...cell, isDark: !cell.isDark };
            }
            return cell;
          });
        }
        return row;
      });
    });
  }

  function handleTestMaze() {
    exploreMaze(gridData);
  }

  // AI LOGIC
  interface Cell {
    isDark: boolean;
    isStart: boolean;
    isEnd: boolean;
    isAi: boolean;
  }
  type Grid = Cell[][];

  // to update ai movement
  // accepts row/col/grid setter from explore maze
  function aiColorChange(CurrRow: number, CurrCol: number) {
    setGridData((prevGrid: Grid) => {
      return prevGrid.map((row, rIndex) => {
        if (rIndex === CurrRow) {
          return row.map((col, cIndex) => {
            if (cIndex === CurrCol) {
              return { ...col, isAi: true };
            }
            return col;
          });
        }
        return row;
      });
    });
  }

  // fath finding algorithm for maze
  // passing in the grid and the grid setting function
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

    return hasPath;
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function findPaths(grid: Grid, startRow: number, startCol: number) {
    let stack = [
      { row: startRow, col: startCol, cell: grid[startRow][startCol] },
    ];
    let visited = new Set();

    try {
      while (stack.length > 0) {
        let { row, col, cell } = stack.pop()!;

        // update color for AI path
        aiColorChange(row, col);

        if (cell.isEnd) {
          setAiMoving(false);
          return true;
        }
        let pos = row + "," + col;
        visited.add(pos);

        await sleep(200);

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
    } catch (error) {
      console.log("Error occured with AI pathfinding:", error);
    } finally {
      setAiMoving(false);
    }

    alert("Path must connect the green and red squares");
    return false;
  }

  function clearAiPath() {
    if (aiMoving) return;
    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        return row.map((cell, cIndex) => {
          return { ...cell, isAi: false };
        });
      });
    });
  }

  function clearPath() {
    if (aiMoving) return;
    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        return row.map((cell, cIndex) => {
          if (!cell.isEnd || cell.isStart) {
            return { ...cell, isDark: true };
          } else {
            return cell;
          }
        });
      });
    });
  }

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-stone-200">
        <div className="w-full flex justify-evenly">
          <>
            <button onClick={clearPath}>Clear Path</button>
            <button
              onClick={() => {
                if (!aiMoving) {
                  setAiMoving(true);
                  clearAiPath();
                  handleTestMaze();
                }
              }}
            >
              Test Maze
            </button>
            <button onClick={clearAiPath}>Clear AI Path</button>
          </>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCells}, 1fr)`,
            gridTemplateRows: `repeat(${numCells}, 1fr)`,
            gap: "0.1rem",
            padding: ".5rem",
            borderWidth: "4px",
            borderColor: "rgb(68 64 60)",
            backgroundColor: "rgb(120 113 108)",
          }}
          className={`w-screen border-4 border-gray-800`}
        >
          {gridData.map((row, rowIndex) =>
            row.map((cell, columnIndex) => (
              <Cell
                key={`${rowIndex}-${columnIndex}`}
                isDark={cell.isDark}
                isStart={cell.isStart}
                isEnd={cell.isEnd}
                isAi={cell.isAi}
                onClick={() => {
                  if (!aiMoving) {
                    handleCellClick(rowIndex, columnIndex);
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

// x
// x
// x
// xxxx
// xxxx
// xxxx
