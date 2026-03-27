export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "Your Gemini API Key is missing in your Vercel Environment Variables setting." });
    }

    // Vercel auto-parses req.body if the content-type is application/json
    const payloadContent = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payloadContent
    });
    
    // Attempt to pass through the response safely
    let data;
    const responseText = await response.text();
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({ error: "Google API returned invalid JSON: " + responseText.substring(0, 200) });
    }

    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
