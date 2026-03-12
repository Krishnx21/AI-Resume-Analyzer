import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  // On Windows (especially inside OneDrive-synced folders), Vite's default
  // cache under node_modules/.vite can sometimes fail to delete due to file locks.
  // Keeping cache outside node_modules is more reliable.
  cacheDir: ".vite-cache",
  server: {
    port: 5173,
  },
});

