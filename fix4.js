const fs = require("fs");
const file = "src/app/portfolio/page.tsx";
let data = fs.readFileSync(file, "utf8");

// Replace handler
const oldHandlerMatch = data.match(/const handleAccordionClick = [\s\S]*?};\n/);
if (oldHandlerMatch) {
    const newHandler = `
    const [openIndex, setOpenIndex] = useState<number>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex(prev => (prev === index ? -1 : index));
    };
`;
    data = data.replace(oldHandlerMatch[0], newHandler);
}

// Remove onClick from the accordion wrapper
data = data.replace(/className="timeline reveal tl-accordion" onClick=\{handleAccordionClick\}/, `className="timeline reveal tl-accordion"`);

// Replace items
let parts = data.split(/<div className="tl-entry(?: is-open)?">/);
if (parts.length > 1) {
    let newData = parts[0];
    for (let i = 1; i < parts.length; i++) {
        let idx = i - 1;
        // There are 12 items. Wait, are there other tl-entry on the page?
        // Let us check if there are others. Oh, there are "is-advisory" ones later on!
        // We only want to replace the first 11 or so.
        // Wait! The pattern matches exactly `<div className="tl-entry">` and `<div className="tl-entry is-open">`.
        // The advisory ones are `<div className="tl-entry is-advisory">`! So they are unaffected!
        
        // We also need to replace the inner toggle.
        let piece = parts[i];
        piece = piece.replace(/<div aria-expanded="(true|false)" className="tl-head-row tl-toggle" role="button" tabIndex=\{0\}>/, 
            `<div aria-expanded={openIndex === ${idx}} className="tl-head-row tl-toggle" role="button" tabIndex={0} onClick={() => toggleAccordion(${idx})}>`);
        
        newData += `<div className={\`tl-entry \${openIndex === ${idx} ? "is-open" : ""}\`}>` + piece;
    }
    data = newData;
}

fs.writeFileSync(file, data);
console.log("Replaced items. Length of parts:", parts.length);

