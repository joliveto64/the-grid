import { useState, useRef, useEffect } from "react";
import { createGrid } from "../createMaze";
import { supabase } from "../supabaseClient";

export default function useSharedState() {
  const [tempGridSize, setTempGridSize] = useState(10);
  const [gridSize, setGridSize] = useState(10);
  const [gridData, setGridData] = useState(createGrid(gridSize, gridSize));
  const [isDragging, setIsDragging] = useState(false);
  const stopAi = useRef<boolean>(false);
  const touchedCells = useRef<Set<string>>(new Set());
  const [pathRightFirst, setPathRightFirst] = useState(true);
  const [aiDone, setAiDone] = useState(false);
  const [userScore, setUserScore] = useState<string | number>("");
  const [numMazes, setNumMazes] = useState<number>(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
    pathRightFirst,
    setPathRightFirst,
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
  };
}
