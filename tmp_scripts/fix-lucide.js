const fs = require('fs');
let c = fs.readFileSync('src/app/ClientPage.tsx', 'utf8');

c = c.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport Script from 'next/script';"
);

c = c.replace(
    "<nav className=\"nav\">",
    "<Script src=\"https://unpkg.com/lucide@latest\" onLoad={() => window.lucide && window.lucide.createIcons()} />\n      <nav className=\"nav\">"
);

c = c.replace(
    "useEffect(() => {\n    const handleHashChange",
    "useEffect(() => {\n    if (window.lucide) window.lucide.createIcons();\n    const handleHashChange"
);

fs.writeFileSync('src/app/ClientPage.tsx', c);
