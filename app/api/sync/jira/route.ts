export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("releasehub");

    // ✅ Fetch REAL Jira data
    const res = await fetch(
      "https://pravallikagumudavelli.atlassian.net/rest/api/3/search/jql?jql=project=RH&maxResults=50",
      {
        headers: {
          Authorization: `Basic ${process.env.JIRA_TOKEN}`, // ✅ from .env
          Accept: "application/json",
        },
      }
    );

    const data = await res.json();
    
    // ✅ Convert Jira response → your format
    const jiraIssues = data.issues.map((issue: any) => ({
      key: issue.key,
      status: issue.fields.status.name,
    }));

    // ✅ Clear old data
    await db.collection("jira").deleteMany({});

    // ✅ Insert real Jira data
    await db.collection("jira").insertMany(jiraIssues);

    return Response.json({
      message: "✅ Jira data synced (REAL DATA)",
      count: jiraIssues.length,
    });

  } catch (error) {
    console.error("Jira Sync Error:", error);
    
    return Response.json(
      {
        error: "❌ Failed to sync Jira data"
      },
      { status: 500 }
    );
  }
}
``
