import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("releasehub");

  // 🔹 Simulated Jira data (later replace with real Jira API)
  const jiraIssues = [
    { key: "MATTRESS-101", status: "Done" },
    { key: "MATTRESS-102", status: "In Progress" },
    { key: "MATTRESS-103", status: "Blocked" }
  ];

  await db.collection("jira").deleteMany({});
  await db.collection("jira").insertMany(jiraIssues);

  return Response.json({
    message: "✅ Jira data synced to MongoDB",
    count: jiraIssues.length
  });
}
