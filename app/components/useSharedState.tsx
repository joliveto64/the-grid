import { useState, useRef, useEffect } from "react";
import { createGrid } from "../createMaze";
import { supabase } from "../supabaseClient";

export default function useSharedState() {
  const [tempGridSize, setTempGridSize] = useState(10);
  const [gridSize, setGridSize] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const stopAi = useRef<boolean>(false);
  const touchedCells = useRef<Set<string>>(new Set());
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize, 0));
  const [aiDone, setAiDone] = useState(false);
  const [userScore, setUserScore] = useState<string | number>("");
  const [numMazes, setNumMazes] = useState<number>();
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const randomNum = useRef<number>(0);

  useEffect(() => {
    async function fetchCount() {
      const { data, error } = await supabase
        .from("counter")
        .select("count")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error retrieving count:", error);
      } else {
        setNumMazes(data.count);
      }
    }

    fetchCount();
  }, []);

  return {
    gridData,
    setGridData,
    stopAi,
    gridSize,
    setGridSize,
    touchedCells,
    tempGridSize,
    setTempGridSize,
    aiDone,
    setAiDone,
    userScore,
    setUserScore,
    numMazes,
    setNumMazes,
    showHowToPlay,
    setShowHowToPlay,
    randomNum,
  };
}
