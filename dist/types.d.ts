export interface PackOptions {
    outputFile?: string;
    includePatterns?: string[];
    excludePatterns?: string[];
    maxFileSizeKB?: number;
    showTree?: boolean;
}
export interface PackedFile {
    relativePath: string;
    content: string;
    sizeBytes: number;
    extension: string;
}
export interface PackResult {
    tree: string;
    files: PackedFile[];
    totalFiles: number;
    totalBytes: number;
    estimatedTokens: number;
    output: string;
}
//# sourceMappingURL=types.d.ts.map