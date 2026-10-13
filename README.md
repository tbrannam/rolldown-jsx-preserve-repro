# Minimal reproduction: `jsx: 'preserve'` fails through `builtin:vite-transform`

```
pnpm install && pnpm build
```

**Expected:** JSX preserved in the output, i.e.

```js
function C() {
	return <button>hi</button>;
}
```

**Actual:**

```
[PARSE_ERROR] Unexpected JSX expression
   ╭─[ src/index.tsx:2:9 ]
 2 │   return <button>hi</button>
   │          ┬
   │ Help: JSX syntax is disabled and should be enabled via the parser options
───╯
```

## Control: the plugin is the cause

`rolldown.config.control.mjs` is identical except that `viteTransformPlugin` is not
registered:

```
pnpm build:control     # succeeds, JSX preserved
pnpm build              # fails, PARSE_ERROR
```

Same input, same `transform: { jsx: 'preserve' }`, same rolldown version. The only
difference is whether `builtin:vite-transform` is in the pipeline.

## Why

`builtin:vite-transform` reports `module_type: Some(ModuleType::Js)` unconditionally
(`crates/rolldown_plugin_vite_transform/src/lib.rs:113`). With `jsx: 'preserve'`,
`jsx_plugin` is `false`, so the transformer leaves `JSXElement` nodes in the AST and
codegen emits JSX verbatim — but the output is still declared `Js`, so the module is
re-parsed with JSX disabled.

Bare `rolldown()` without this plugin preserves JSX correctly, so this is specific to
the plugin Vite routes `.ts`/`.tsx`/`.jsx` through on build.

## Notes

- Shaped after [`rolldown/rolldown-starter-stackblitz`](https://github.com/rolldown/rolldown-starter-stackblitz),
  so `rolldown` is aliased to `@rolldown/browser` (the WASM build) and this runs
  unmodified in StackBlitz.
- Pinned to `@rolldown/browser@1.2.13`, the version this was verified against. Change it
  to `latest` to check against newer releases.
- Reproduces identically on native `rolldown@1.2.13`.
