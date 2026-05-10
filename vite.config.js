import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const SCRIPT_PATH =
  "/macros/s/AKfycbyK5CR7mzHpW_K-8QN-ZtfCnYJfcM1ZRlqKAy3gA8lRcs1GedqGvK65sKAmLStZPqDp/exec";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "https://script.google.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          const queryIndex = path.indexOf("?");

          if (queryIndex === -1) {
            return SCRIPT_PATH;
          }

          return `${SCRIPT_PATH}${path.slice(queryIndex)}`;
        },
      },
    },
  },
});