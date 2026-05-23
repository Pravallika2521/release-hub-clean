export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("releasehub");

    // Simulated Jira data (safe fallback)
    const jiraIssues = [
      { key: "MATTRESS-101", status: "Done" },
      { key: "MATTRESS-102", status: "In Progress" },
      { key: "MATTRESS-103", status: "Blocked" }
    ];

    // Clear old data
    await db.collection("jira").deleteMany({});

    // Insert fresh Jira data
    await db.collection("jira").insertMany(jiraIssues);

    return Response.json({
      message: "✅ Jira data synced",
      count: jiraIssues.length
    });

  } catch (error) {
    return Response.json(
      {
        error: "❌ Failed to sync Jira data"
      },
      { status: 500 }
    );
  }
}
