const fs = require('fs');
let data = fs.readFileSync('src/app/portfolio/page.tsx', 'utf8');
const newHandler = '    const [openIndex, setOpenIndex] = useState<number>(0);\n    const toggleAccordion = (index: number) => {\n        setOpenIndex(prev => (prev === index ? -1 : index));\n    };\n';
data = data.replace(/const handleAccordionClick = [\s\S]*?};\n/, newHandler);
let count = 0;
    let idx = count++;
});
fs.writeFileSync('src/app/portfolio/page.tsx', data);
console.log('Done', count);
