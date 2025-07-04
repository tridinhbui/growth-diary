#!/usr/bin/env node

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 7890;

console.log(`🚀 Starting Growth Diary Magical UI on port ${port}...`);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
🌟 Growth Diary Magical UI is ready! ✨
📍 Local: http://${hostname}:${port}
🎨 Magical features: Enabled
🚀 Performance: Optimized
📱 Mobile: Responsive
🔮 UI Effects: Glassmorphism + Particles
      `);
    });
}); 