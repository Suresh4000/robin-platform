// Custom server entry point for cPanel, Webuzo, Plesk, Hostinger, etc.
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Initialize the Next.js application
// If deployed to production, it will use the compiled .next directory
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            // Let Next.js handle all routing
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    })
        .once('error', (err) => {
            console.error('Server failed to start:', err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Application successfully started on http://${hostname}:${port}`);
        });
});
