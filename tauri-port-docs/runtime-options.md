# Runtime Options

## Rust‑based runtimes that implement Node‑style APIs

| Runtime | Language | Node‑API Support | Stars | Notes |
|---------|----------|-------------------|-------|-------|
| **bun** | Rust | ✔️ (drop‑in compatible with Node scripts) | 96,332 | Full JavaScript/TypeScript runtime, bundler, test runner, package manager. Ideal if you want a single Rust binary with Node API support. |

## Pure JavaScript engines (no Node APIs)

| Runtime | Language | Node‑API Support | Stars | Notes |
|---------|----------|-------------------|-------|-------|
| **boa** | Rust | ❌ | 7,626 | Minimal JS engine, no Node APIs. |
| **lumen** | Rust | ❌ | 273 | 100 % test262 compliant, no Node APIs. |
| **andromeda** | Rust | ❌ | (see original list) | Many Web APIs but no Node APIs. |
| **ruffle‑rs/ruffle** | Rust | ❌ | 18,719 | Flash Player emulator, not a JS engine. |

## Summary

- If you need a **pure Rust runtime that is Node‑compatible**, **bun** is the only option in the list.
- All other Rust engines are pure JavaScript engines and would require you to implement a Node‑API shim yourself.
- The current project already uses **Express (Node.js)**, so the simplest path is to keep it and run it as a child process from Tauri.
