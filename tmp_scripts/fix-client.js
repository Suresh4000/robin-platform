const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Find where `'use client';` begins
const splitIndex = pageContent.indexOf("'use client';");
const serverCode = pageContent.substring(0, splitIndex);
const clientCode = pageContent.substring(splitIndex);

// For server component, we need to import ClientPage from './ClientPage'
let newServerCode = serverCode.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React from 'react';\nimport { ClientPage } from './ClientPage';"
);

// We should also remove 'useState', 'useEffect' from server component if they are not used. They are not used.

fs.writeFileSync('src/app/page.tsx', newServerCode);
fs.writeFileSync('src/app/ClientPage.tsx', clientCode);
