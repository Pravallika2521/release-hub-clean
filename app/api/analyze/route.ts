import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("releasehub");

  const jira = await db.collection("jira").find().toArray();

  const total = jira.length;
  const closed = jira.filter(i => i.status === "Done").length;
  const blocked = jira.filter(i => i.status.includes("Block")).length;
  const open = total - closed;

  const MAX_OPEN = 2;

  let status = "GO ✅";
  let reason = "All OK";

  if (open > MAX_OPEN) {
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
}
