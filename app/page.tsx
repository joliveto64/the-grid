"use client";
import Cell from "./components/Cell";
import useSharedState from "./components/useSharedState";
import { exploreMaze } from "./pathfinding";
import { createMaze } from "./createMaze";

// TODO: predict ai path - most fun
// TODO: randomize maybe 2-4 options for decision order
// TODO: make mazes and upload to SB
// TODO: option to generate or use user maze

export default function Home() {
  const {
    gridData,
    setGridData,
    gridSize,
    setGridSize,
    touchedCells,
    stopAi,
    pathRightFirst,
    setPathRightFirst,
    tempGridSize,
    setTempGridSize,
  } = useSharedState();

  type Grid = {
    isDark: boolean;
    isStart: boolean;
    isEnd: boolean;
    isAi: boolean;
    isUser: boolean;
  }[][];

  // AI FUNCTIONS ////////////////////////////////////
  function handleTestMaze(grid: Grid) {
    if (countUserCells(grid) < gridSize * 2 - 3) return;

    stopAi.current = false;
    clearAiPath();

    let gridCopy = grid.map((row) => {
      return row.map((cell) => {
        return { ...cell };
      });
    });

    const object = exploreMaze(gridCopy, pathRightFirst);

    if (object?.path) {
      aiColorChange(object.path);
    }
  }

  function countUserCells(grid: Grid) {
    let numUserCells = 0;
    for (let r = 0; r < gridData.length; r++) {
      for (let c = 0; c < gridData[0].length; c++) {
        if (grid[r][c].isUser) {
          numUserCells++;
        }
      }
    }

    return numUserCells;
  }

  function switchCurrentOrder(pathRightFirst: boolean) {
    setPathRightFirst(Math.random() > 0.5 ? pathRightFirst : !pathRightFirst);
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function aiColorChange(array: [number, number][]): Promise<void> {
    for (let i = 0; i < array.length; i++) {
      let CurrRow = array[i][0];
      let CurrCol = array[i][1];

      if (stopAi.current) return;

      await delay(100);

      setGridData((prevGrid: Grid) => {
        const newGrid = [...prevGrid];

        if (newGrid[CurrRow] && newGrid[CurrRow][CurrCol]) {
          newGrid[CurrRow] = [...newGrid[CurrRow]];
          newGrid[CurrRow][CurrCol] = {
            ...newGrid[CurrRow][CurrCol],
            isAi: true,
          };
        }

        return newGrid;
      });
    }
  }

  function resetAi() {
    stopAi.current = true;

    setTimeout(() => {
      clearAiPath();
    }, 80);
  }

  function clearAiPath() {
    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        return row.map((cell, cIndex) => {
          return { ...cell, isAi: false };
        });
      });
    });
  }

  // USER FUNCTIONS
  function userColorChange(inputRow: number, inputCol: number): void {
    setGridData((prevGrid: Grid) => {
      const newGrid = [...prevGrid];

      if (newGrid[inputRow] && newGrid[inputRow][inputCol]) {
        newGrid[inputRow] = [...newGrid[inputRow]];
        newGrid[inputRow][inputCol] = {
          ...newGrid[inputRow][inputCol],
          isUser: true,
        };
      }

      return newGrid;
    });
  }

  function addStartToTouched() {
    for (let r = 0; r < gridData.length; r++) {
      for (let c = 0; c < gridData[r].length; c++) {
        if (gridData[r][c].isStart) {
          touchedCells.current.add(`${r},${c}`);
        }
      }
    }
  }

  function clearPath(r: number, c: number) {
    setGridData((prevGrid) =>
      prevGrid.map((row, rIndex) =>
        row.map((cell, cIndex) => {
          if (cell.isStart) {
            return cell;
          } else if (r === rIndex && c === cIndex) {
            return { ...cell, isUser: false };
          } else {
            return cell;
          }
        })
      )
    );
  }

  function allowedToClick(row: number, col: number) {
    const up = `${row - 1},${col}`;
    const down = `${row + 1},${col}`;
    const right = `${row},${col + 1}`;
    const left = `${row},${col - 1}`;

    if (gridData[row][col].isDark) return false;

    if (
      touchedCells.current.has(down) ||
      touchedCells.current.has(right) ||
      touchedCells.current.has(up) ||
      touchedCells.current.has(left)
    ) {
      return true;
    }
  }

  function handleClick(row: number, col: number) {
    if (
      touchedCells.current.has(`${row},${col}`) &&
      !gridData[row][col]?.isStart &&
      !gridData[row][col]?.isEnd
    ) {
      clearPath(row, col);
      touchedCells.current.delete(`${row},${col}`);
      return;
    } else if (allowedToClick(row, col)) {
      touchedCells.current.add(`${row},${col}`);
      userColorChange(row, col);
    }
  }

  function handleNewMazeButton() {
    resetAi();
    const newGridSize = tempGridSize;
    setGridSize(newGridSize);
    setGridData(createMaze(newGridSize, newGridSize));

    touchedCells.current.clear();
    addStartToTouched();
    switchCurrentOrder(pathRightFirst);
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    let size = parseInt(event.target.value);
    setTempGridSize(size);
  }

  return (
    <div className="App">
      <div className="h-screen w-screen p-2 flex flex-col justify-center items-center bg-stone-200 landscape:flex-row landscape:justify-evenly">
        <div className="w-full flex justify-evenly landscape:flex-col landscape:items-center landscape:w-24">
          <span>Current order: {pathRightFirst ? "→↓←↑" : "↓→↑←"}</span>
          <>
            <button className="landscape:mb-4" onClick={handleNewMazeButton}>
              New Maze!
            </button>
            <button
              disabled={false}
              className="landscape:mb-4"
              onClick={() => {
                handleTestMaze(gridData);
              }}
            >
              Test AI
            </button>
            <label htmlFor="select">Size:</label>
            <select
              id="select"
              value={tempGridSize}
              onChange={handleSelectChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${Math.floor(gridSize)}, 1fr)`,
            gap: "0.1rem",
            padding: ".5rem",
            border: "none",
            backgroundColor: "rgb(120 113 108)",
          }}
          className={`portrait:w-full border-4 border-gray-800 landscape:width-vh`}
          // onTouchMove={handleTouchMove}
          // onTouchEnd={handleTouchEnd}
        >
          {gridData.map((row, rowIndex) =>
            row.map((cell, columnIndex) => (
              <Cell
                key={`${rowIndex}-${columnIndex}`}
                dataRow={rowIndex}
                dataCol={columnIndex}
                isDark={cell.isDark}
                isStart={cell.isStart}
                isEnd={cell.isEnd}
                isAi={cell.isAi}
                isUser={cell.isUser}
                onTouchStart={(event) => {
                  // handleTouchStart(event);
                }}
                onClick={() => {
                  handleClick(rowIndex, columnIndex);
                }}
              />
            ))
          )}
        </div>
        <div className="w-full flex justify-evenly landscape:flex-col landscape:items-center landscape:w-24 landscape:text-center mt-4">
          {/* <span className="landscape:mb-4 ">Cells: {countCells(gridData)}</span> */}
          {/* <button onClick={resetAi}>Clear AI Path</button> */}
        </div>
      </div>
    </div>
  );
}
