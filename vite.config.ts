import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
  },
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, "src/index.ts"),
  //     name: "supa-app",
  //   },
  // },
});
