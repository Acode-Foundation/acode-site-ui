import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 443,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger() && basicSsl({
      name: "Local test server",
      domains: ["localhost"],
      certDir: path.resolve(__dirname, "./certs"),
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
