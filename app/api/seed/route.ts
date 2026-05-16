import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("releasehub");

  await db.collection("jira").deleteMany({});

  await db.collection("jira").insertMany([
    { key: "MATTRESS-1", status: "Done" },
    { key: "MATTRESS-2", status: "Done" },
    { key: "MATTRESS-3", status: "In Progress" },
    { key: "MATTRESS-4", status: "Blocked" }
  ]);

  return Response.json({ message: "✅ Data inserted" });
}
``
