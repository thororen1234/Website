# Discord Module Explorer

The `/discord/modules` pages. This is a port of the `/e` route from
[sadan4/sadan.zip](https://github.com/sadan4/sadan.zip) to this site's Next.js app.

## License

Everything in this directory is derived from sadan.zip and is licensed under the
**GNU Affero General Public License v3.0**. The full text is in [LICENSE.md](LICENSE.md).
The same applies to the thin route files that mount it:

- `src/app/(site)/discord/modules/page.tsx`
- `src/app/discord/modules/**`

The rest of this repository is not covered by this license.

Under AGPL section 13, anyone using the explorer over the network must be able to get
its source. The explorer pages link back here and to the upstream repository.

## What's here

| Path                            | Origin                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `libsadancore/`                 | `wasm-pack` output of upstream `crates/libsadancore` with `libsadancore.patch` applied |
| `libsadancore.patch`            | Our changes to upstream's Rust, see below                                              |
| `lsp/intl-keys.json`            | Unmodified copy of upstream `src/utils/discordI18n/key-mappings.json`                  |
| `worker/`, `lsp.ts`, `store.ts` | Ported from upstream `src/routes/e` and `src/routes/_/e`                               |
| `ui/`                           | Rewritten for this site, based on upstream's `src/routes/e/-ui`                        |

## Rebuilding `libsadancore`

The WASM was built from upstream commit
[`e04e0916`](https://github.com/sadan4/sadan.zip/tree/e04e0916a5072e4d127974b7c20ea885d468f49d)
with [`libsadancore.patch`](libsadancore.patch) applied. Together those are its complete Rust source.
The patch only touches `crates/libsadancore`:

- The server URL can be set at runtime with `set_server_base_url`, instead of being fixed to
  `s-d-br.sadan.zip`. The workers set it to `SERVER_BASE_URL` from [`config.ts`](config.ts).
- Build metadata exposes a `channels` list (`stable`, `canary`, or both). Servers that don't send it
  return an empty list.

Requirements: a nightly Rust toolchain with the `wasm32-unknown-unknown` target,
[`wasm-pack`](https://github.com/drager/wasm-pack), and `clang` (for `zstd-sys`).

```sh
git clone https://github.com/sadan4/sadan.zip && cd sadan.zip
git checkout e04e0916a5072e4d127974b7c20ea885d468f49d
git apply <this repo>/src/explorer/libsadancore.patch
wasm-pack build --target web --scope sadan4 crates/libsadancore
cp crates/libsadancore/pkg/libsadancore{.js,.d.ts,_bg.wasm,_bg.wasm.d.ts} \
    <this repo>/src/explorer/libsadancore/
```

Don't copy the generated `package.json` or `.gitignore`. The pnpm workspace would
pick up the first, and the second ignores everything.

## Build data

The explorer reads builds from [tracker.thororen.com](https://github.com/thororen1234/Discord-Bundle-Downloader),
which serves the same API as upstream's `s-d-br.sadan.zip` plus release channels. Change `SERVER_BASE_URL`
in [`config.ts`](config.ts) to point it anywhere else that serves that API.

## Changes from upstream

- Moved from TanStack Router, Vite and React Query to the Next.js App Router with a small `useAsync` hook
- Syntax highlighting uses `@shikijs/monaco` in place of upstream's vendored vscode-textmate/Oniguruma setup.
  The Oxocarbon theme was dropped and GitHub Light was added.
- The UI uses this site's styling in place of upstream's component library
- Workers fall back to a dedicated `Worker` when `SharedWorker` is unavailable
