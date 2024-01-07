export default function Cell(props: {
  isDark: boolean;
  isStart: boolean;
  isEnd: boolean;
  isAi: boolean;
  onClick: () => void;
}) {
  function chooseColor() {
    if (props.isStart) {
      return "bg-green-600";
    } else if (props.isEnd) {
      return "bg-red-700";
    } else if (props.isDark) {
      return "bg-stone-600 active:bg-stone-400";
    } else if (props.isAi) {
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
      onClick={props.onClick}
    ></div>
  );
}
