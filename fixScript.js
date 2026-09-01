const fs = require('fs');
const file = 'src/app/portfolio/page.tsx';
let data = fs.readFileSync(file, 'utf8');

const newHandler = `
    const [openIndex, setOpenIndex] = useState<number>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(prev => (prev === index ? -1 : index));
    };
`;
data = data.replace(/const handleAccordionClick = [\\s\\S]*?};\\n/, newHandler);
data = data.replace('className="timeline reveal tl-accordion" onClick={handleAccordionClick}', 'className="timeline reveal tl-accordion"');

let count = 0;
data = data.replace(/<div className="tl-entry( is-open)?">\\s*<div aria-expanded="(true|false)" className="tl-head-row tl-toggle" role="button" tabIndex=\\{0}\\}>/g, function() {
    let idx = count++;
    return `<div className={\`tl-entry ${openIndex === ${idx} ? 'is-open' : ''}\`}>\\n                                <div aria-expanded={openIndex === ${idx}} className="tl-head-row tl-toggle" role="button" tabIndex={0} onClick={() => toggleAccordion(${idx})}>`;
});

fs.writeFileSync(file, data);
console.log('Replaced', count);