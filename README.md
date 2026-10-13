<div align="center">

# promptpak

**Fast, zero-dependency codebase packager for LLMs with directory tree generation.**

[![npm version](https://img.shields.io/npm/v/promptpak?style=flat-square&color=58a6ff)](https://www.npmjs.com/package/promptpak)
[![license](https://img.shields.io/github/license/xxnetme/promptpak?style=flat-square&color=3fb950)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](#)
[![node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue?style=flat-square)](https://nodejs.org)

<br/>

Pack entire codebases into structured, token-optimized context for Claude, ChatGPT, DeepSeek, and Cursor in seconds.

```bash
npx promptpak . -o context.md
```

</div>

---

### Features

* **Zero Dependencies:** Starts instantly in under 5ms without large `node_modules`.
* **Smart Filtering:** Automatically ignores `node_modules`, lockfiles, binary files, images, and `.git`.
* **Directory Tree Visualization:** Generates a clean ASCII tree layout at the top of the prompt.
* **Token Estimation:** Calculates character count and estimated token usage.
* **Direct File Output:** Output to stdout or save directly to a markdown/text file (`-o`).

---

### CLI Usage

#### Pack to file
```bash
npx promptpak . -o context.md
```

#### Pack specific subfolder
```bash
npx promptpak ./src -o src_context.md
```

#### Pipe to clipboard (macOS / Linux)
```bash
npx promptpak ./src | pbcopy
```

---

### Programmatic API

```ts
import { packDirectory } from "promptpak";

const result = packDirectory("./src", {
    maxFileSizeKB: 250
});

console.log(`Packed ${result.totalFiles} files (~${result.estimatedTokens} tokens)`);
console.log(result.output);
```

---

### License

MIT License (c) 2026 [xxnetme](https://github.com/xxnetme)
