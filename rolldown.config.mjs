import { defineConfig } from 'rolldown'
import { viteTransformPlugin } from 'rolldown/experimental'

// `builtin:vite-transform` reports ModuleType::Js unconditionally. With
// jsx: 'preserve' it leaves JSX in the AST and codegen emits it verbatim, so the
// module is then re-parsed with JSX disabled => PARSE_ERROR.
export default defineConfig({
  input: './src/index.tsx',
  external: ['react', 'react/jsx-runtime'],
  transform: { jsx: 'preserve' },
  plugins: [
    viteTransformPlugin({
      root: process.cwd(),
      include: [/\.(m?ts|[jt]sx)$/],
      exclude: [/\.js$/],
      isServerConsumer: false,
      transformOptions: { jsx: 'preserve', sourcemap: false },
    }),
  ],
})
