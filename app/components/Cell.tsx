export default function Cell(props: {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
  isUser: boolean;
  dataRow: number;
  dataCol: number;
  onClick: () => void;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
}) {
  function chooseColor() {
    if (props.isStart) {
      return "bg-emerald-500";
    } else if (props.isEnd) {
      return "bg-red-400";
    } else if (props.isDark) {
      return "bg-stone-600 active:bg-stone-400";
    } else if (props.isUser && props.isAi) {
      return "bg-gradient-to-tr from-15% from-blue-400 to-yellow-300";
    } else if (props.isUser) {
      return "bg-blue-400";
    } else if (props.isAi) {
      return "bg-yellow-300";
    } else {
      return "bg-stone-200";
    }
  }

  return (
    <div
      className={`aspect-square w-full ${chooseColor()}`}
      onTouchStart={props.onTouchStart}
      data-row={props.dataRow}
      data-col={props.dataCol}
      onClick={props.onClick}
    ></div>
  );
}
