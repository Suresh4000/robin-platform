'use strict';
const fetch = require('node-fetch');

async function main() {
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@robinjones.com', password: 'password' })
    });
    const cookie = loginRes.headers.raw()['set-cookie'];
    console.log("Logged in. Cookie", Boolean(cookie));

    const histRes = await fetch('http://localhost:3000/api/ops/history', {
        headers: { cookie: cookie ? cookie[0] : '' }
    });

    const text = await histRes.text();
    console.log("History API Response:", text);
}

main().catch(console.error);
