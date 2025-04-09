import { dbService } from "@/lib";

export async function GET(req: Request) {
  const snap = await dbService.collection("products").get();

  const items = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return Response.json({ message: "api end point check!", items });
}
