/// <reference types="vite/client" />

interface ViteTypeOptions {
    strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_MAP_TILER_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
