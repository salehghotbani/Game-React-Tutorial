import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export function previewPlugin(): Plugin {
  return {
    name: 'react-quest-isolated-preview',
    resolveId(id) { if (id.startsWith('virtual:react-quest-')) return `\0${id}`; },
    async load(id) {
      if (id === '\0virtual:react-quest-preview') {
        // Student tests need React.act and helpful development diagnostics inside the isolated laboratory.
        const bundle = await build({ entryPoints: [fileURLToPath(new URL('../../packages/learning-engine/src/preview/local-entry.ts', import.meta.url))], bundle: true, write: false, metafile: true, format: 'iife', minify: true, define: { 'process.env.NODE_ENV': '"development"' } });
        for (const file of Object.keys(bundle.metafile!.inputs)) if (!file.includes('node_modules')) this.addWatchFile(resolve(file));
        return `export default ${JSON.stringify(bundle.outputFiles[0]!.text)}`;
      }
      if (id === '\0virtual:react-quest-bridge') {
        const result = await build({ entryPoints: [fileURLToPath(new URL('../../packages/learning-engine/src/preview/bridge.ts', import.meta.url))], bundle: true, write: false, metafile: true, format: 'esm', target: 'es2022' });
        for (const file of Object.keys(result.metafile!.inputs)) if (!file.includes('node_modules')) this.addWatchFile(resolve(file));
        return `export default ${JSON.stringify(result.outputFiles[0]!.text)}`;
      }
    }
  };
}
