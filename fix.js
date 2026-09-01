const fs = require("fs");
const file = "src/app/portfolio/page.tsx";
let data = fs.readFileSync(file, "utf8");

let count = 0;
data = data.replace(/<div className="tl-entry( is-open)?">\s*<div aria-expanded="(true|false)" className="tl-head-row tl-toggle" role="button" tabIndex=\{0\}>/g, function(match, p1, p2) {
    let idx = count++;
    return `<div className={\`tl-entry ${openIndex === ${idx} ? "is-open" : ""}\`}>
                                <div aria-expanded={openIndex === ${idx}} className="tl-head-row tl-toggle" role="button" tabIndex={0} onClick={() => toggleAccordion(${idx})}>`;
});

fs.writeFileSync(file, data);
console.log("Replaced", count, "entries");

