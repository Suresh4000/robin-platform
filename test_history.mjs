async function main() {
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sureshkumarmr2004@gmail.com', password: 'securepassword123' }) // based on earlier
    });
    const cookie = loginRes.headers.get('set-cookie');
    console.log("Logged in. Cookie", Boolean(cookie));

    const histRes = await fetch('http://localhost:3000/api/ops/history', {
        headers: { cookie: cookie || '' }
    });

    const text = await histRes.text();
    console.log("History API Response:", text);
}
main();
