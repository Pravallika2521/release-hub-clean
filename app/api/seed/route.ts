export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("releasehub");

    // Clear existing data
    await db.collection("jira").deleteMany({});

    // Insert sample data
    await db.collection("jira").insertMany([
      { key: "MATTRESS-1", status: "Done" },
      { key: "MATTRESS-2", status: "Done" },
      { key: "MATTRESS-3", status: "In Progress" },
      { key: "MATTRESS-4", status: "Blocked" }
    ]);

    return Response.json({
      message: "✅ Data inserted",
      count: 4
    });

  } catch (error) {
    return Response.json(
      {
        error: "Failed to seed data"
      },
      { status: 500 }
    );
  }
}
