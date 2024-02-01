import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../app/supabaseClient.js";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    // If not a GET request, set the Allow header for correct HTTP semantics and return a 405 status
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Directly call incrementCount() for a GET request
  incrementCount();
  res.status(200).json({ text: "Count incremented" });
}

async function fetchCount(
  setNumMazes: React.Dispatch<React.SetStateAction<number | undefined>>
) {
  const { data, error } = await supabase
    .from("counter")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) {
    setNumMazes(undefined);
    console.error("Error retrieving count:", error);
  } else {
    setNumMazes(data.count);
  }
}

async function incrementCount() {
  let num: number = 0;
  const { data, error } = await supabase
    .from("counter")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error retrieving count:", error);
  } else {
    num = data.count;
  }

  const { error: updateError } = await supabase
    .from("counter")
    .update({ count: num + 1 })
    .eq("id", 1);

  if (updateError) {
    console.error("Error updating count:", updateError);
  }
}

export { fetchCount };
