"use client";
import Cell from "./components/Cell";
import { useState, useRef, useEffect } from "react";
import { orderReadout, allowedToClick, gradeUser } from "./utils";
import { exploreMaze } from "./pathfinding";
import { fetchCount } from "@/pages/api/useDB";
import { createMaze, createGrid } from "../pages/api/createMaze";

// TODO: refactor
// TODO: zoom out stuck when rotation landscape > portrait

export default function Home() {
  const [tempGridSize, setTempGridSize] = useState(10);
  const [gridSize, setGridSize] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize, 0));
  const [aiDone, setAiDone] = useState(false);
  const [userScore, setUserScore] = useState<string | number>("");
  const [numMazes, setNumMazes] = useState<number | undefined>();
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [isCoolDown, setIsCoolDown] = useState(false);

  const touchedCells = useRef<Set<string>>(new Set());
  const randomNum = useRef<number>(0);
  const stopAi = useRef<boolean>(false);

  type Grid = {
    isDark: boolean;
    isStart: boolean;
    isEnd: boolean;
    isAi: boolean;
    isUser: boolean;
  }[][];

  // AI FUNCTIONS ////////////////////////////////////
  useEffect(() => {
    fetchCount(setNumMazes);
  }, []);

  function handleTestMaze(grid: Grid) {
    stopAi.current = false;
    clearAiPath();

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

  useEffect(() => {
    if (aiDone) {
      setUserScore(gradeUser(gridData));
      setAiDone(false);
    }
  }, [aiDone]);

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function aiColorChange(array: [number, number][]): Promise<void> {
    try {
      for (let i = 0; i < array.length; i++) {
        let CurrRow = array[i][0];
        let CurrCol = array[i][1];

        if (stopAi.current) return;

        await delay(200);

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
    }, 210);
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

  useEffect(() => {
    function addStartToTouched() {
      for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {
          if (gridData[r][c].isStart) {
            touchedCells.current.add(`${r},${c}`);
          }
        }
      }
    }

    addStartToTouched();
  }, [gridData]);

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

  function handleNewMazeButton() {
    if (numMazes) {
      setNumMazes((prev) => (prev !== undefined ? prev + 1 : prev));
    }

    apiCall();

    resetAi();
    const newGridSize = tempGridSize;
    setGridSize(newGridSize);
    randomNum.current = Math.floor(Math.random() * 4);
    setGridData(createMaze(newGridSize, newGridSize, randomNum.current));

    touchedCells.current.clear();
    setUserScore("");
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    let size = parseInt(event.target.value);
    setTempGridSize(size);
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
    } else if (allowedToClick(touchedCells, gridData, row, col)) {
      touchedCells.current.add(`${row},${col}`);
      userColorChange(row, col);
    }
  }

  function onMouseDown() {
    setIsDragging(true);
  }

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (isDragging) {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const rowString = target?.getAttribute("data-row");
      const colString = target?.getAttribute("data-col");

      if (rowString && colString) {
        const row = parseInt(rowString);
        const col = parseInt(colString);

        if (allowedToClick(touchedCells, gridData, row, col)) {
          touchedCells.current.add(`${row},${col}`);
          userColorChange(row, col);
        }
      }
    }
  }

  function onMouseUp() {
    setIsDragging(false);
  }

  function handleScaleChange() {
    if (scale === 1) {
      setScale(0.5);
    } else {
      setScale(1);
    }
  }

  // Place this code inside your React component
  async function apiCall() {
    try {
      const response = await fetch("/api/useDb"); // Make sure this matches your Next.js API route

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
    } catch (error: any) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  }

  return (
    <div className="App">
      <div className="top-info">
        <span className="current-order">{orderReadout(randomNum.current)}</span>
        <button
          className="go-button"
          disabled={false}
          onClick={() => {
            handleTestMaze(gridData);
          }}
        >
          Go
        </button>
        <button
          className="new-grid-button"
          style={isCoolDown ? { filter: "opacity(.5)" } : {}}
          onClick={() => {
            if (!isCoolDown) {
              handleNewMazeButton();
              setIsCoolDown(true);

              setTimeout(() => {
                setIsCoolDown(false);
              }, 3000);
            }
          }}
        >
          New
        </button>
        <div>
          <select
            className="select"
            value={tempGridSize}
            onChange={handleSelectChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <span
          className="scale"
          onClick={() => {
            handleScaleChange();
          }}
        >
          +/-
        </span>
      </div>
      <div
        style={{
          backgroundColor: "rgba(114, 114, 114, .1)",
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateRows: `repeat(${gridSize}}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            transform: `scale(${scale})`,
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
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
                  handleClick(rowIndex, columnIndex);
                }}
              />
            ))
          )}
        </div>
      </div>
      <div className="bottom-info">
        <span>{`Score: ${userScore}`}</span>
        <span>{`${
          numMazes ? `Mazes Generated: ${numMazes}` : "[offline]"
        }`}</span>
      </div>
      <span className="how-to-play">
        <strong
          onClick={() => {
            setShowHowToPlay(!showHowToPlay);
          }}
        >
          How to play:
        </strong>
        {showHowToPlay
          ? ` fill out the grid to predict the path the
        AI will take to solve the maze. If the order is →↓←↑, the computer will
        always go right if possible. If it can't go right, it will go down. If
        it can't go down, it will go left. If it can't go left, it will go up.
        If the computer hits a dead-end, it will revert to the most recently
        skipped path. Fill out the grid and press "Go" when you're ready! If on mobile, turn your phone sideways for a closer view.`
          : ""}{" "}
      </span>
    </div>
  );
}
