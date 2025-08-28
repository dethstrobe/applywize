import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { redwood } from "rwsdk/vite"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/playwright-report/**", "**/test-results/**"],
    },
  },
  environments: {
    ssr: {},
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
    redwood(),
    tailwindcss(),
  ],
})
