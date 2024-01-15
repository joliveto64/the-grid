"use client";
import Cell from "./components/Cell";
import useSharedState from "./components/useSharedState";
import { exploreMaze } from "./pathfinding";
import { createMaze } from "./createMaze";
import { useEffect } from "react";
import { supabase } from "./supabaseClient";

// TODO: maybe add more orders for pathfinding
// TODO: add click + drag for desktop

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
    aiDone,
    setAiDone,
    userScore,
    setUserScore,
    numMazes,
    setNumMazes,
    showHowToPlay,
    setShowHowToPlay,
  } = useSharedState();

  type Grid = {
    isDark: boolean;
    isStart: boolean;
    isEnd: boolean;
    isAi: boolean;
    isUser: boolean;
  }[][];

  // AI FUNCTIONS ////////////////////////////////////
  async function incrementCount(newCount: number) {
    const { error: updateError } = await supabase
      .from("counter")
      .update({ count: newCount })
      .eq("id", 1);

    if (updateError) {
      console.error("Error updating count:", updateError);
    } else {
      console.log("Updated Count");
    }
  }

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

  function compareUserAi(grid: Grid) {
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

    setUserScore(Math.round(ratio * 100) + "%");
  }

  useEffect(() => {
    if (aiDone) {
      compareUserAi(gridData);
      setAiDone(false);
    }
  }, [aiDone]);

  function switchCurrentOrder(pathRightFirst: boolean) {
    setPathRightFirst(Math.random() > 0.5 ? pathRightFirst : !pathRightFirst);
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function aiColorChange(array: [number, number][]): Promise<void> {
    try {
      for (let i = 0; i < array.length; i++) {
        let CurrRow = array[i][0];
        let CurrCol = array[i][1];

        if (stopAi.current) return;

        await delay(125);

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
    } finally {
      setAiDone(true);
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
    const newNum = numMazes + 1;
    setNumMazes(newNum);
    incrementCount(newNum);

    resetAi();
    const newGridSize = tempGridSize;
    setGridSize(newGridSize);
    setGridData(createMaze(newGridSize, newGridSize, pathRightFirst));

    touchedCells.current.clear();
    addStartToTouched();
    switchCurrentOrder(pathRightFirst);
    setUserScore("");
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    let size = parseInt(event.target.value);
    setTempGridSize(size);
  }

  return (
    <div className="App">
      <div className="top-info">
        <span className="current-order">
          Current order: {pathRightFirst ? "→↓←↑" : "↓→↑←"}
        </span>
        <div className="top-buttons">
          <button onClick={handleNewMazeButton}>New Grid</button>
          <button
            disabled={false}
            onClick={() => {
              handleTestMaze(gridData);
            }}
          >
            Go
          </button>
          <div>
            <label htmlFor="select">Size: </label>
            <select
              className="select"
              id="select"
              value={tempGridSize}
              onChange={handleSelectChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${gridSize}}, 1fr)`,
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
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
      <div className="bottom-info">
        {/* <button onClick={resetAi}>Clear AI Path</button> */}
        <span>{`Score: ${userScore}`}</span>
        <span>{`Grids Generated: ${numMazes}`}</span>
      </div>
      <span className="how-to-play">
        <strong
          onClick={() => {
            setShowHowToPlay(!showHowToPlay);
          }}
        >
          How to play
        </strong>
        {showHowToPlay
          ? `: fill out the grid to predict the path the
        AI will take to solve the maze. The current order dictates the
        computer's decision-making. If the order is →↓←↑, the computer will
        always go right if possible. If it can't go right, it will go down. If
        it can't go down, it will go left. If it can't go left, it will go up.
        If the computer hits a dead-end, it will revert to the most recently
        skipped path. Fill out the grid and press "Go" when you're ready!`
          : ""}{" "}
      </span>
    </div>
  );
}
