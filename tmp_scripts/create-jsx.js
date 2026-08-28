const fs = require('fs');

const htmlContent = fs.readFileSync('C:\\Users\\SVAAN TECH\\Downloads\\robin-jones-website (9).html', 'utf-8');

const styleRegex = /<style>([\s\S]*?)<\/style>/;
const styleMatch = htmlContent.match(styleRegex);
if (styleMatch) {
    fs.writeFileSync('src/app/public-contour.css', styleMatch[1]);
}

let bodyRegex = /<body>([\s\S]*?)<\/body>/;
let bodyMatch = htmlContent.match(bodyRegex);

if (bodyMatch) {
    let jsx = bodyMatch[1];

    // Convert basic attributes
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    // Close unclosed tags
    const unclosedTags = ['img', 'input', 'hr', 'br', 'meta', 'link'];
    for (const tag of unclosedTags) {
        const reg = new RegExp(`<${tag}([^>]*[^/])>`, 'g');
        jsx = jsx.replace(reg, `<${tag}$1 />`);
    }

    // Fix inline styles - simple heuristic for style="xxx"
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        const props = p1.split(';').filter(p => p.trim() !== '');
        const styleObj = {};
        for (const prop of props) {
            let [key, val] = prop.split(':');
            if (!key || !val) continue;
            key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            val = val.trim();
            styleObj[key] = val;
        }
        return 'style={' + JSON.stringify(styleObj) + '}';
    });

    // SVG specific attributes
    const svgAttrs = [
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray',
        'fill-rule', 'clip-rule', 'clip-path'
    ];
    for (const attr of svgAttrs) {
        const camel = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const reg = new RegExp(`${attr}=`, 'g');
        jsx = jsx.replace(reg, `${camel}=`);
    }

    // Write to a temporary file to inspect
    fs.writeFileSync('src/app/public-dump.jsx', jsx);
}
