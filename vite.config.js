import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      {
        name: 'gemini-proxy',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req, res) => {
            if (req.method !== 'POST') return res.end();
            
            let body = '';
            req.on('data', chunk => { body += chunk.toString() });
            req.on('end', async () => {
              try {
                const apiKey = env.VITE_GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ error: "API Key missing in .env" }));
                }

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body
                });
                const data = await response.json();
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          })
        }
      }
    ]
  }
})
