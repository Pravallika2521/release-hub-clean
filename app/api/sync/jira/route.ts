export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("releasehub");

    // ✅ Step 1: Call Jira API
    const jiraRes = await fetch(
      "https://pravallikagumudavelli.atlassian.net/rest/api/3/search/jql?jql=project=RH&maxResults=50",
      {
        headers: {
          Authorization: `Basic ${process.env.JIRA_API_TOKEN}`, // ✅ MUST MATCH VERCEL NAME
          Accept: "application/json",
        },
      }
    );

    // ✅ Debug status
    console.log("Jira Status:", jiraRes.status);

    const jiraText = await jiraRes.text();
    console.log("Jira Response:", jiraText);

    if (!jiraRes.ok) {
      return Response.json({
        error: "❌ Jira API failed",
        status: jiraRes.status,
        details: jiraText,
      });
    }

    const data = JSON.parse(jiraText);

    // ✅ No data returned
    if (!data.issues || data.issues.length === 0) {
      return Response.json({
        message: "⚠️ Connected but no Jira issues found",
      });
    }

    // ✅ Step 2: Transform data
    const jiraIssues = data.issues.map((issue: any) => ({
      key: issue.key,
      status: issue.fields.status.name,
    }));

    // ✅ Step 3: Save to MongoDB
    await db.collection("jira").deleteMany({});
    await db.collection("jira").insertMany(jiraIssues);

    return Response.json({
      message: "✅ Jira synced successfully (REAL DATA)",
      count: jiraIssues.length,
    });

  } catch (error: any) {
    console.error("Error:", error);

    return Response.json(
      {
        error: "❌ Failed to sync Jira data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
