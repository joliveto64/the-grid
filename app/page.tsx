"use client";
import Cell from "./components/Cell";
import useSharedState from "./components/useSharedState";
import { PreventOpenSpace, countCells } from "./utils";
import { exploreMaze } from "./pathfinding";
import { createMaze } from "./createMaze";

// TODO: make user solve then AI solve after. Doesn't work well on top of each other
// TODO: logic to improve corner swiping
// TODO: games modes: predict AI path, beat AI shortest path
// TODO: -----user generated mazes for all modes, upload to supabase
// TODO: -----logic to change pathfinding order
// TODO: -----need better pathfinding for shortest path

export default function Home() {
  const {
    gridData,
    setGridData,
    gridSize,
    setGridSize,
    isDragging,
    setIsDragging,
    touchedCells,
    stopAi,
  } = useSharedState();
  type Cell = {
    isDark: boolean;
    isStart: boolean;
    isEnd: boolean;
    isAi: boolean;
    isUser: boolean;
  };
  type Grid = Cell[][];

  function handleCellClick(rowIndex: number, columnIndex: number) {
    if (PreventOpenSpace(rowIndex, columnIndex, gridData)) {
      return;
    }

    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((cell, cIndex) => {
            if (cIndex === columnIndex) {
              if (cell.isStart || cell.isEnd) return cell;
              return { ...cell, isUser: !cell.isUser };
            }
            return cell;
          });
        }
        return row;
      });
    });
  }

  function handleTestMaze(grid: Grid) {
    let gridCopy = grid.map((row) => {
      return row.map((cell) => {
        return { ...cell };
      });
    });

    const object = exploreMaze(gridCopy);

    if (object?.path) {
      aiColorChange(object.path);
    }
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

  function clearAiPath() {
    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        return row.map((cell, cIndex) => {
          return { ...cell, isAi: false };
        });
      });
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

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const rowString = target.getAttribute("data-row");
    const colString = target.getAttribute("data-col");

    if (rowString && colString) {
      const row = parseInt(rowString);
      const col = parseInt(colString);

      if (gridData[row][col].isDark) return;
      if (touchedCells.current.has(`${row},${col}`)) {
        clearPath(row, col);

        if (gridData[row][col]) {
          if (!gridData[row][col].isStart) {
            touchedCells.current.delete(`${row},${col}`);
          }
        }
        return;
      }

      const up = `${row - 1},${col}`;
      const down = `${row + 1},${col}`;
      const right = `${row},${col + 1}`;
      const left = `${row},${col - 1}`;

      if (
        gridData[row][col].isStart ||
        gridData[row][col].isUser ||
        touchedCells.current.has(down) ||
        touchedCells.current.has(right) ||
        touchedCells.current.has(up) ||
        touchedCells.current.has(left)
      ) {
        touchedCells.current.add(`${row},${col}`);
        userColorChange(row, col);
        setIsDragging(true);
      }
    }
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (isDragging) {
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const rowString = target?.getAttribute("data-row");
      const colString = target?.getAttribute("data-col");
      console.log("drag");

      if (rowString && colString) {
        const row = parseInt(rowString);
        const col = parseInt(colString);

        if (
          gridData[row][col].isDark ||
          touchedCells.current.has(`${row},${col}`)
        ) {
          return;
        }

        const up = `${row - 1},${col}`;
        const down = `${row + 1},${col}`;
        const right = `${row},${col + 1}`;
        const left = `${row},${col - 1}`;

        if (
          touchedCells.current.has(down) ||
          touchedCells.current.has(right) ||
          touchedCells.current.has(up) ||
          touchedCells.current.has(left)
        ) {
          touchedCells.current.add(`${row},${col}`);
          userColorChange(row, col);
        }
      }
    }
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    setIsDragging(false);
  }

  return (
    <div className="App">
      <div className="h-screen w-screen p-2 flex flex-col justify-center items-center bg-stone-200 landscape:flex-row landscape:justify-evenly">
        <div className="w-full flex justify-evenly landscape:flex-col landscape:items-center landscape:w-24">
          <>
            <button
              className="landscape:mb-4"
              onClick={() => {
                touchedCells.current.clear();
                setGridData(createMaze(gridSize, gridSize));
                addStartToTouched();
              }}
            >
              New Maze!
            </button>
            <button
              onClick={() => {
                stopAi.current = false;
                clearAiPath();
                handleTestMaze(gridData);
              }}
            >
              AI solve
            </button>
          </>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: "0.1rem",
            padding: ".5rem",
            border: "none",
            backgroundColor: "rgb(120 113 108)",
          }}
          className={`portrait:w-full border-4 border-gray-800 landscape:width-vh`}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
                onClick={() => {
                  // handleCellClick(rowIndex, columnIndex);
                }}
                onTouchStart={(event) => {
                  handleTouchStart(event);
                }}
              />
            ))
          )}
        </div>
        <div className="w-full flex justify-evenly landscape:flex-col landscape:items-center landscape:w-24 landscape:text-center mt-4">
          {/* <button
            onClick={() => {
              clearPath();
              clearAiPath();
            }}
          >
            Clear All
          </button> */}
          <span className="landscape:mb-4 ">Cells: {countCells(gridData)}</span>
          <button
            onClick={() => {
              stopAi.current = true;

              setTimeout(() => {
                clearAiPath();
              }, 200);
            }}
          >
            Clear AI Path
          </button>
        </div>
      </div>
    </div>
  );
}
