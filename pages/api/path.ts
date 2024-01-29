import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Handler is being called, method: ", req.method);

  // This will only handle GET requests.
  if (req.method === "GET") {
    res.status(200).json({ text: "Hello" });
  } else {
    // Respond with a method not allowed error if it's not a GET request.
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
