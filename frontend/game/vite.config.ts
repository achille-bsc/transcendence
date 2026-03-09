import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
			include: ["src/**/*"],
			exclude: ["src/main.ts"],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "KongGame",
			formats: ["es", "umd"],
			fileName: (format) =>
				format === "es" ? "kong-game.js" : "kong-game.umd.cjs",
		},
		rollupOptions: {
			// Rien à externaliser — 0 dépendances runtime
		},
		sourcemap: true,
		cssCodeSplit: false,
	},
});
