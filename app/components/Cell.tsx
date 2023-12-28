interface CellProps {
  isDark: boolean;
  onClick: () => void;
}

export default function Cell({ isDark, onClick }: CellProps) {
  return (
    <div
      className={`aspect-square w-full ${
        isDark ? "bg-gray-800" : "bg-gray-100"
      }`}
      onClick={onClick}
    ></div>
  );
}
