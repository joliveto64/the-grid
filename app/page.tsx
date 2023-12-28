"use client";
import { useState } from "react";
import Cell from "./components/Cell";

export default function Home() {
  const numCells = 20;
  const [gridData, setGridData] = useState(createGrid(numCells, numCells));

  // function to create the grid
  // output: [[{}],[{}],[{}]]
  function createGrid(rows: number, columns: number) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let column = 0; column < columns; column++) {
        currentRow.push({ isDark: true });
      }
      grid.push(currentRow);
    }

    return grid;
  }

  function handleClick(rowIndex: number, columnIndex: number) {
    console.log("clicked");
    // Create a deep copy of the current grid
    setGridData((prevGrid) => {
      return prevGrid.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((cell, cIndex) => {
            if (cIndex === columnIndex) {
              return { ...cell, isDark: !cell.isDark }; // Toggle the isDark property
            }
            return cell;
          });
        }
        return row;
      });
    });
  }

  return (
    <div className="h-screen w-screen flex items-center bg-gray-100">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCells}, 1fr)`,
          gridTemplateRows: `repeat(${numCells}, 1fr)`,
          gap: "0.25rem",
          padding: "0.25rem",
          borderWidth: "4px",
          borderColor: "#1F2937",
        }}
        className={`w-screen border-4 border-gray-800`}
      >
        {gridData.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <Cell
              key={`${rowIndex}-${columnIndex}`}
              isDark={cell.isDark}
              onClick={() => {
                handleClick(rowIndex, columnIndex);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
