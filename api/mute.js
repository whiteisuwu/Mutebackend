import { writeFile, readFile } from "fs/promises";
import path from "path";

const filePath = path.resolve("./muted.json");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: "Missing key" });

      const data = await readFile(filePath, "utf-8");
      const json = JSON.parse(data);

      if (!json.muted.includes(key)) {
        json.muted.push(key);
        await writeFile(filePath, JSON.stringify(json, null, 2));
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: "Internal error", detail: e.message });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
