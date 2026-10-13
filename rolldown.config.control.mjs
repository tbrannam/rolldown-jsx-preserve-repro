import { defineConfig } from 'rolldown'

// Control: byte-identical to rolldown.config.mjs except that
// builtin:vite-transform (viteTransformPlugin) is not registered.
// This one succeeds and preserves the JSX, which isolates the plugin as the cause.
export default defineConfig({
  input: './src/index.tsx',
  external: ['react', 'react/jsx-runtime'],
  transform: { jsx: 'preserve' },
})
