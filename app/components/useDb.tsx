import { supabase } from "../supabaseClient.js";

export default function useDb() {
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

  async function incrementCount(
    setNumMazes: React.Dispatch<React.SetStateAction<number | undefined>>
  ) {
    let num: number = 0;
    const { data, error } = await supabase
      .from("counter")
      .select("count")
      .eq("id", 1)
      .single();

    if (error) {
      setNumMazes(undefined);
      console.error("Error retrieving count:", error);
    } else {
      num = data.count;
    }

    const { error: updateError } = await supabase
      .from("counter")
      .update({ count: num + 1 })
      .eq("id", 1);

    if (updateError) {
      setNumMazes(undefined);
      console.error("Error updating count:", updateError);
    }
  }

  return { incrementCount, fetchCount };
}
