# Step‑by‑Step Plan to Convert to a Stand‑alone Tauri App

## 1. Initialise Tauri

```bash
# From the repository root
npm i -D @tauri-apps/cli
npx tauri init
```

This creates the `src-tauri/` folder and a basic `tauri.conf.json`.

## 2. Build the Frontend into Static Assets

```bash
cd frontend
npm install
npm run build
npm run export   # creates ./out/
```

Copy the exported files into the Tauri project.

```bash
cp -r frontend/out/* src-tauri/assets/
```

## 3. Configure Tauri to Use Those Assets

Edit `src-tauri/tauri.conf.json`:

```json
"build": {
  "distDir": "../src-tauri/assets",
  "devPath": "http://localhost:3000"
}
```

## 4. Package the Express Backend

Create a small shell script `backend/start.sh` (already created above) that
builds and runs the backend.

```bash
#!/usr/bin/env sh
cd backend
npm ci
npm run build
node dist/index.js
```

Make it executable:

```bash
chmod +x backend/start.sh
```

## 5. Launch the Backend from Tauri

Add a Tauri command in `src-tauri/src/main.rs` that starts the backend:

```rust
#[tauri::command]
fn start_backend() {
    use std::process::Command;
    Command::new("sh")
        .arg("../backend/start.sh")
        .spawn()
        .expect("Failed to start backend");
}
```

Register the command in `tauri.conf.json` under `tauri.allowlist`.  Also expose a
command to stop the process if desired.

## 6. Update Frontend API Calls

Change any hard‑coded URLs in the frontend (e.g. `http://localhost:3001`) to
use relative paths or an environment variable that points to `http://127.0.0.1:3001`.

## 7. Build and Test the Tauri App

```bash
npx tauri dev   # runs dev server and opens the app
```

Verify that the UI loads and that API calls succeed.

## 8. Package for Distribution

```bash
npx tauri build
```

This produces a single binary (and installer on supported platforms) that
contains:

1. The static frontend assets.
2. The bundled Express server (as a child process).
3. The Rust Tauri wrapper.

---

## 9. Optional – Use Bun Instead of Express

If you decide to replace Express with **bun** (a Node‑compatible Rust runtime), follow these additional steps:

1. Install bun globally: `curl -fsSL https://bun.sh/install | sh`.
2. Replace the `backend/start.sh` script with one that starts bun:
   ```bash
   #!/usr/bin/env sh
   cd backend
   bun install
   bun run dev  # or bun run build && bun run start
   ```
3. Ensure the frontend still talks to the same port (`127.0.0.1:3001`).

The rest of the Tauri setup remains unchanged.
