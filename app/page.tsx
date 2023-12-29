"use client";
import { useState } from "react";
import { exploreMaze } from "@/ai";
import Cell from "./components/Cell";

export default function Home() {
  const [numCells, setNumCells] = useState(5);
  const [gridData, setGridData] = useState(createGrid(numCells, numCells));

  // function to create the initial grid state
  function createGrid(rows: number, columns: number) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let column = 0; column < columns; column++) {
        if (row === 0 && column === 0) {
          currentRow.push({ isDark: false, isStart: true, isEnd: false });
        } else if (row === numCells - 1 && column === numCells - 1) {
          currentRow.push({ isDark: false, isStart: false, isEnd: true });
        } else {
          currentRow.push({ isDark: true, isStart: false, isEnd: false });
        }
      }
      grid.push(currentRow);
    }

    // output: [[{}],[{}],[{}]]
    return grid;
  }

  // update state on cells to change color
  function handleCellClick(rowIndex: number, columnIndex: number) {
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

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-stone-200">
      <div className="w-full flex justify-evenly">
        <button onClick={handleTestMaze}>Test Maze</button>
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
              onClick={() => {
                handleCellClick(rowIndex, columnIndex);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
