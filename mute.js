export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const repo = "whiteisuwu/Mutebackend"; // Change this!
  const filePath = "muted.json";

  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  if (req.method === "GET") {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, { headers });
    const data = await response.json();
    const content = JSON.parse(atob(data.content));
    return res.status(200).json(content);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const getResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, { headers });
    const getData = await getResponse.json();
    const sha = getData.sha;
    const current = JSON.parse(atob(getData.content));
    const updated = [...new Set([...current, ...body.muted])];
    const update = {
      message: "Update muted.json",
      content: btoa(JSON.stringify(updated, null, 2)),
      sha,
    };
    await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(update),
    });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
