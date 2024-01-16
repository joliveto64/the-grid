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
      return "#10b981";
    } else if (props.isEnd) {
      return "#fb7185";
    } else if (props.isDark) {
      return "#4f5b66";
    } else if (props.isUser && props.isAi) {
      return "#60a5fa";
    } else if (props.isUser) {
      return "#60a5fa";
    } else if (props.isAi) {
      return "#fcd34d";
    } else {
      return "#e5e7eb";
    }
  }

  return (
    <div
      style={{
        transition: ".1s all",
        background: ` ${chooseColor()}`,
        border: props.isUser && props.isAi ? "6px solid #fcd34d" : "",
        aspectRatio: "1/1",
      }}
      onTouchStart={props.onTouchStart}
      data-row={props.dataRow}
      data-col={props.dataCol}
      onClick={props.onClick}
    ></div>
  );
}
