import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";
export * from "./types.js";
const DEFAULT_IGNORED = new Set([
    "node_modules", ".git", "dist", "build", "coverage", ".turbo",
    ".next", ".nuxt", ".output", "package-lock.json", "pnpm-lock.yaml",
    "yarn.lock", ".DS_Store", "Thumbs.db"
]);
const BINARY_EXTENSIONS = new Set([
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf",
    ".zip", ".tar", ".gz", ".exe", ".dll", ".so", ".dylib",
    ".mp3", ".mp4", ".mov", ".woff", ".woff2", ".ttf", ".eot"
]);
function buildTree(dir, prefix = "", relativeBase = dir) {
    const lines = [];
    const entries = readdirSync(dir, { withFileTypes: true })
        .filter(e => !DEFAULT_IGNORED.has(e.name) && !e.name.startsWith("."))
        .sort((a, b) => {
        if (a.isDirectory() === b.isDirectory())
            return a.name.localeCompare(b.name);
        return a.isDirectory() ? -1 : 1;
    });
    entries.forEach((entry, idx) => {
        const isLast = idx === entries.length - 1;
        const pointer = isLast ? "└── " : "├── ";
        lines.push(`${prefix}${pointer}${entry.name}`);
        if (entry.isDirectory()) {
            const nextPrefix = prefix + (isLast ? "    " : "│   ");
            lines.push(...buildTree(join(dir, entry.name), nextPrefix, relativeBase));
        }
    });
    return lines;
}
export function packDirectory(rootDir, options = {}) {
    const files = [];
    const maxBytes = (options.maxFileSizeKB || 500) * 1024;
    function walk(dir) {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (DEFAULT_IGNORED.has(entry.name) || entry.name.startsWith("."))
                continue;
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            }
            else if (entry.isFile()) {
                const ext = extname(entry.name).toLowerCase();
                if (BINARY_EXTENSIONS.has(ext))
                    continue;
                const stat = statSync(fullPath);
                if (stat.size > maxBytes)
                    continue;
                try {
                    const content = readFileSync(fullPath, "utf8");
                    files.push({
                        relativePath: relative(rootDir, fullPath).replace(/\\/g, "/"),
                        content,
                        sizeBytes: stat.size,
                        extension: ext.slice(1) || "txt"
                    });
                }
                catch {
                    // skip unreadable
                }
            }
        }
    }
    walk(rootDir);
    const treeLines = [rootDir, ...buildTree(rootDir)];
    const tree = treeLines.join("\n");
    let totalBytes = 0;
    const outputParts = [];
    outputParts.push("# Codebase Context\n");
    outputParts.push("## Directory Structure\n```text");
    outputParts.push(tree);
    outputParts.push("```\n\n## Source Files\n");
    for (const f of files) {
        totalBytes += f.sizeBytes;
        outputParts.push(`### File: \`${f.relativePath}\`\n\`\`\`${f.extension}`);
        outputParts.push(f.content);
        outputParts.push("```\n");
    }
    const output = outputParts.join("\n");
    const estimatedTokens = Math.ceil(output.length / 4);
    if (options.outputFile) {
        writeFileSync(options.outputFile, output, "utf8");
    }
    return {
        tree,
        files,
        totalFiles: files.length,
        totalBytes,
        estimatedTokens,
        output
    };
}
//# sourceMappingURL=index.js.map