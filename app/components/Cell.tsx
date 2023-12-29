interface CellProps {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  onClick: () => void;
}

export default function Cell({ isDark, isStart, isEnd, onClick }: CellProps) {
  function chooseColor() {
    if (isStart) {
      return "bg-sky-600";
    } else if (isEnd) {
      return "bg-green-600";
    } else if (isDark) {
      return "bg-stone-700";
    } else {
      return "bg-stone-200";
    }
  }

  return (
    <div
      className={`aspect-square w-full ${
        //         68,64,60          231,229,228
        chooseColor()
      }`}
      onClick={onClick}
    ></div>
  );
}
