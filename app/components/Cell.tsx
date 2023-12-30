interface CellProps {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
  onClick: () => void;
}

export default function Cell({
  isDark,
  isStart,
  isEnd,
  isAi,
  onClick,
}: CellProps) {
  function chooseColor() {
    if (isStart) {
      return "bg-green-600";
    } else if (isEnd) {
      return "bg-red-700";
    } else if (isDark) {
      return "bg-stone-700";
    } else if (isAi) {
      return "bg-pink-400";
    }
    {
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
