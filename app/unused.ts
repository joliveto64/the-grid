// function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
//   const target = event.target as HTMLElement;
//   const rowString = target.getAttribute("data-row");
//   const colString = target.getAttribute("data-col");

//   if (rowString && colString) {
//     const row = parseInt(rowString);
//     const col = parseInt(colString);

//     if (
//       touchedCells.current.has(`${row},${col}`) &&
//       !gridData[row][col]?.isStart &&
//       !gridData[row][col]?.isEnd
//     ) {
//       clearPath(row, col);
//       touchedCells.current.delete(`${row},${col}`);
//       return;
//     }

//     if (allowedToClick(row, col)) {
//       touchedCells.current.add(`${row},${col}`);
//       userColorChange(row, col);
//       setIsDragging(true);
//     }
//   }
// }

// function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
//   if (isDragging) {
//     const touch = event.touches[0];
//     const target = document.elementFromPoint(touch.clientX, touch.clientY);
//     const rowString = target?.getAttribute("data-row");
//     const colString = target?.getAttribute("data-col");

//     if (rowString && colString) {
//       const row = parseInt(rowString);
//       const col = parseInt(colString);

//       if (allowedToClick(row, col)) {
//         touchedCells.current.add(`${row},${col}`);
//         userColorChange(row, col);
//       }
//     }
//   }
// }

// function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
//   const currentTime = new Date().getTime();
//   if (currentTime - lastTouchEnd.current <= 700) {
//     event.preventDefault();
//   }
//   lastTouchEnd.current = currentTime;
//   setIsDragging(false);
// }
