interface CellProps {
  isDark: boolean;
  onClick: () => void;
}

export default function Cell({ isDark, onClick }: CellProps) {
  const cellColor = isDark ? "[#282828]" : "#F5F5F5";
  return <div className={`bg-${cellColor} aspect-square w-full`}></div>;
}
