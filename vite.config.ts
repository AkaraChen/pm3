import { defineConfig } from "vite-plus";

export default defineConfig({
    lint: { options: { typeAware: true, typeCheck: true } },
    build: {
        lib: {
            entry: "./src/index.ts",
            formats: ["es"],
            fileName: "index",
        },
        rollupOptions: {
            external: [/^node:/, "commander", "inquirer", /@inquirer\/prompts/, "cli-table3", "globby", "pm2"],
        },
    },
});
