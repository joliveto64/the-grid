"use client";
import Cell from "./components/Cell";
import useSharedState from "./components/useSharedState";
import { PreventOpenSpace, countCells } from "./utils";
import { exploreMaze } from "./pathfinding";

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

  interface Cell {
    isDark: boolean;
    isStart: boolean;
    isEnd: boolean;
    isAi: boolean;
  }
  type Grid = Cell[][];

  function aiColorChange(array: [number, number][]) {
    for (let i = 0; i < array.length; i++) {
      let CurrRow = array[i][0];
      let CurrCol = array[i][1];

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
    if (aiMoving) return;
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

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-stone-200">
        <div className="w-full flex justify-evenly">
          <>
            <button
              onClick={() => {
                clearAiPath();
                handleTestMaze(gridData);
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
                  handleCellClick(rowIndex, columnIndex);
                }}
              />
            ))
          )}
        </div>
        <div className="w-full flex justify-evenly">
          <button onClick={clearPath}>Clear Path</button>
          <span>Cells: {countCells(gridData)}</span>
        </div>
      </div>
    </>
  );
}

// TODO: mihai recs: make grid controller class (separate file), define grid functions within the class
// have separate grid that is for the UI
// gris class only deals with updating grid information, separate functions to change the UI

// NOTES: just have UI state which is the current state. Then, move the pathfinding to its own file. Create deep copies of the grid state with only the required information included and pass that grid data into the path logic function call. sleep can be abstracted and passed in. After pathfinding, data is sent to colorChange which updates the UE separate from the pathfinding logic. see chat gpt conversation
