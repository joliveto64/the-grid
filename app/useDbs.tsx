import { supabase } from "./supabaseClient.js";

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

// export { incrementCount, fetchCount };
