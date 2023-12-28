"use client";
import { useState } from "react";
import Cell from "./components/Cell";

export default function Home() {
  const [gridData, setGridData] = useState(createGrid(10, 10));

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

  function handleClick() {}

  return (
    <div className="h-screen w-screen flex items-center">
      <div className="w-screen grid grid-cols-10 grid-rows-10 gap-1 p-1">
        {gridData.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <Cell
              key={`${rowIndex}-${columnIndex}`}
              isDark={cell.isDark}
              onClick={handleClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

// component of single cell, has state for light//dark
// --state is light/dark
// component for the grid, creates many instances of cell
// --state is the entire grid
