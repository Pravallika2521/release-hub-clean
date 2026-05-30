export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("releasehub");

    const jira = await db.collection("jira").find().toArray();

    const total = jira.length;

    const closed = jira.filter(
      (i) => i.status === "Done"
    ).length;

    const blocked = jira.filter(
      (i) => i.status.toLowerCase().includes("block")
    ).length;

    const open = total - closed;

    const MAX_OPEN = 2;

    let status = "GO ✅";
    let reason = "All OK";

    if (blocked > 0) {
      status = "NO-GO ❌";
      reason = "Blocked tickets present";
    } else if (open > MAX_OPEN) {
      status = "NO-GO ❌";
      reason = "Too many open tickets";
    }

    return Response.json({
      total,
      closed,
      open,
      blocked,
      status,
      reason
    });

  } catch (error) {
    return Response.json(
      { error: "Failed to analyze data" },
      { status: 500 }
    );
  }
}
