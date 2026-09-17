async function main() {
    const res = await fetch('http://localhost:3000/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Lead 2', source: 'Website', email: 'test@test.com' })
    });
    console.log(await res.text());
}
main();
