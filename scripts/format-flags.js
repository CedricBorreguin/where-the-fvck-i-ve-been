const fs = require("fs");
const path = require("path");

const INPUT_DIR = "./svg-flags";
const OUTPUT_DIR = "./svg-circle-flags";
const SIZE = 500;
const BORDER_WIDTH = 20;
const RADIUS = SIZE / 2;
const CLIP_RADIUS = RADIUS - BORDER_WIDTH;

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    console.log(`Created input directory: ${INPUT_DIR}`);
    console.log("Please add SVG files to this directory and run again.");
    process.exit(0);
}

function extractDimensions(svgContent) {
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
    if (viewBoxMatch) {
        const [minX, minY, width, height] = viewBoxMatch[1].split(/\s+/).map(Number);
        return { minX, minY, width, height };
    }

    const widthMatch = svgContent.match(/width=["']([^"']+)["']/);
    const heightMatch = svgContent.match(/height=["']([^"']+)["']/);

    const width = widthMatch ? parseFloat(widthMatch[1]) : 100;
    const height = heightMatch ? parseFloat(heightMatch[1]) : 100;

    return { minX: 0, minY: 0, width, height };
}

function extractSvgContent(svgContent) {
    const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    return match ? match[1] : "";
}

function extractNamespaces(svgContent) {
    const namespaces = [];
    const nsRegex = /xmlns(?::[a-zA-Z0-9]+)?=["'][^"']+["']/g;
    let match;

    while ((match = nsRegex.exec(svgContent)) !== null) {
        if (!match[0].startsWith("xmlns=")) {
            namespaces.push(match[0]);
        }
    }

    return namespaces;
}

function transformSvg(svgContent, filename) {
    const dims = extractDimensions(svgContent);
    const innerContent = extractSvgContent(svgContent);
    const namespaces = extractNamespaces(svgContent);

    const circleDiameter = CLIP_RADIUS * 2;
    const scaleX = circleDiameter / dims.width;
    const scaleY = circleDiameter / dims.height;
    const scale = Math.max(scaleX, scaleY);

    const scaledWidth = dims.width * scale;
    const scaledHeight = dims.height * scale;

    const offsetX = RADIUS - scaledWidth / 2;
    const offsetY = RADIUS - scaledHeight / 2;

    const clipId = `clip-${path.basename(filename, ".svg").replace(/[^a-zA-Z0-9]/g, "_")}`;

    const nsString = namespaces.length > 0 ? " " + namespaces.join(" ") : "";

    const transformedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"${nsString} width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <clipPath id="${clipId}">
      <circle cx="${RADIUS}" cy="${RADIUS}" r="${CLIP_RADIUS}"/>
    </clipPath>
  </defs>
  
  <!-- White border circle -->
  <circle cx="${RADIUS}" cy="${RADIUS}" r="${RADIUS}" fill="white"/>
  
  <!-- Clipped original content -->
  <g clip-path="url(#${clipId})">
    <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
      <g transform="translate(${-dims.minX}, ${-dims.minY})">
        ${innerContent}
      </g>
    </g>
  </g>
</svg>`;

    return transformedSvg;
}

function processAllSvgs() {
    const files = fs.readdirSync(INPUT_DIR).filter((f) => f.toLowerCase().endsWith(".svg"));

    if (files.length === 0) {
        console.log(`No SVG files found in ${INPUT_DIR}`);
        return;
    }

    console.log(`Found ${files.length} SVG file(s) to process...\n`);

    files.forEach((file) => {
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        try {
            const content = fs.readFileSync(inputPath, "utf8");
            const transformed = transformSvg(content, file);
            fs.writeFileSync(outputPath, transformed, "utf8");
            console.log(`✓ Transformed: ${file}`);
        } catch (err) {
            console.error(`✗ Error processing ${file}: ${err.message}`);
        }
    });

    console.log(`\nOutput saved to: ${OUTPUT_DIR}`);
}

processAllSvgs();
