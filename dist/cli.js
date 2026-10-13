#!/usr/bin/env node
import { packDirectory } from "./index.js";
const VERSION = "1.0.0";
const HELP = `
promptpak — Zero-dependency codebase packager for LLMs

Usage:
  promptpak [dir]          Pack directory into structured LLM context
  promptpak [dir] -o <file> Save context to file (e.g. prompt.txt)

Options:
  -o, --output <file>      Output file path
  --json                   Output metadata as JSON
  -v, --version            Display version
  -h, --help               Display help message

Examples:
  $ promptpak .
  $ promptpak ./src -o context.md
`;
async function main() {
    const args = process.argv.slice(2);
    if (args.includes("-h") || args.includes("--help")) {
        console.log(HELP);
        return;
    }
    if (args.includes("-v") || args.includes("--version")) {
        console.log(`promptpak v${VERSION}`);
        return;
    }
    const json = args.includes("--json");
    let outputFile;
    const outIdx = args.indexOf("-o") !== -1 ? args.indexOf("-o") : args.indexOf("--output");
    if (outIdx !== -1 && args[outIdx + 1]) {
        outputFile = args[outIdx + 1];
    }
    const targetDir = args.find(a => !a.startsWith("-") && a !== outputFile) || ".";
    const result = packDirectory(targetDir, { outputFile });
    if (json) {
        console.log(JSON.stringify({
            totalFiles: result.totalFiles,
            totalBytes: result.totalBytes,
            estimatedTokens: result.estimatedTokens,
            outputFile
        }, null, 2));
        return;
    }
    if (outputFile) {
        console.log(`\x1b[32m✔\x1b[0m Successfully packed ${result.totalFiles} files into ${outputFile}`);
        console.log(`  Size: ${(result.totalBytes / 1024).toFixed(1)} KB`);
        console.log(`  Estimated Tokens: ~${result.estimatedTokens.toLocaleString()}`);
    }
    else {
        console.log(result.output);
    }
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map