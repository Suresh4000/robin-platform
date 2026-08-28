const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
let client = fs.readFileSync('src/app/ClientPage.tsx', 'utf-8');

page = page.replace("import React from 'react';\nimport { ClientPage }", "import { ClientPage }");

client = client.replace(/tabindex/g, 'tabIndex');
client = client.replace("handleContactSubmit = async (e)", "handleContactSubmit = async (e: any)");
client = client.replace("handleNavClick = (e, val)", "handleNavClick = (e: any, val: any)");
client = client.replace("post)", "post: any)");
client = client.replace(/aria-expanded=\{navOpen\} aria-expanded=\{navOpen\}/g, "aria-expanded={navOpen}");
// fix multiple aria-expanded
client = client.replace(/<button aria-expanded="false" aria-label="Open menu" className="nav-toggle" onClick=\{\(\) => setNavOpen\(!navOpen\)\} aria-expanded=\{navOpen\}>/g, '<button aria-label="Open menu" className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}>');

fs.writeFileSync('src/app/page.tsx', page);
fs.writeFileSync('src/app/ClientPage.tsx', client);
