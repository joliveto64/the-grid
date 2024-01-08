"use client";
import Cell from "./components/Cell";
import useSharedState from "./components/useSharedState";
import { PreventOpenSpace, countCells } from "./utils";
import { exploreMaze } from "./pathfinding";
import { createMaze } from "./createMaze";

// TODO: allow user to trace path && determine winner
// TODO: css for landscape / larger screens

export default function Home() {
  const {
    gridData,
    setGridData,
    gridSize,
    setGridSize,
    isDragging,
    setIsDragging,
    touchedCells,
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
              return { ...cell, isDark: !cell.isDark };
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
    console.log(object);

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

      await delay(75);

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
  }

  function userColorChange(inputRow: number, inputCol: number): void {
    setGridData((prevGrid: Grid) => {
      return prevGrid.map((row, rIndex) => {
        if (rIndex === inputRow) {
          return row.map((cell, cIndex) => {
            if (cIndex === inputCol) {
              return { ...cell, isUser: true };
            }
            return cell;
          });
        }
        return row;
      });
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

  function clearPath() {
    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        return row.map((cell, cIndex) => {
          if (cell.isEnd || cell.isStart) {
            return cell;
          } else {
            return { ...cell, isDark: true };
          }
        });
      });
    });
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const rowString = target.getAttribute("data-row");
    const colString = target.getAttribute("data-col");

    if (rowString && colString) {
      const row = parseInt(rowString);
      const col = parseInt(rowString);

      if (
        gridData[row][col].isStart ||
        touchedCells.current.has(`${row},${col}`)
      ) {
        setIsDragging(true);
        touchedCells.current.add(`${row},${col}`);
        console.log("start");
      }
    }
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (isDragging) {
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const rowString = target?.getAttribute("data-row");
      const colString = target?.getAttribute("data-col");

      if (rowString && colString) {
        const row = parseInt(rowString);
        const col = parseInt(colString);
        console.log(row, col);
        touchedCells.current.add(`${row},${col}`);
        userColorChange(row, col);
      }
    }
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    setIsDragging(false);
    console.log("end");
  }

  return (
    <div className="App">
      <div className="h-screen w-screen p-2 flex flex-col justify-center items-center bg-stone-200 landscape:flex-row landscape:justify-evenly">
        <div className="w-full flex justify-evenly landscape:flex-col landscape:items-center landscape:w-24 mb-4">
          <>
            <button
              className="landscape:mb-4"
              onClick={() => {
                setGridData(createMaze(gridSize, gridSize));
              }}
            >
              Generate
            </button>
            <button
              onClick={() => {
                clearAiPath();
                handleTestMaze(gridData);
              }}
            >
              Test Maze
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
          <button
            onClick={() => {
              clearPath();
              clearAiPath();
            }}
          >
            Clear All
          </button>
          <span className="landscape:mb-4 landscape:mt-4">
            Cells: {countCells(gridData)}
          </span>
          <button onClick={clearAiPath}>Clear AI Path</button>
        </div>
      </div>
    </div>
  );
}
