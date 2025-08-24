import path from "node:path";
import fs from "fs-extra";
import { execa } from "execa";
import ora from "ora";

/* ---------------------------
   UI dependency + setup logic
---------------------------- */
function depsForUI(ui) {
  switch (ui) {
    case "tailwind":
      return {
        runtime: [],
        dev: ["tailwindcss", "postcss", "autoprefixer"],
        setup: async (projectDir) => {
          // Write Tailwind + PostCSS config and CSS entry
          await fs.writeFile(
            path.join(projectDir, "tailwind.config.js"),
            `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
`
          );

          await fs.writeFile(
            path.join(projectDir, "postcss.config.js"),
            `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
          );

          // Ensure index.css has Tailwind directives (overwrites minimal base)
          await fs.writeFile(
            path.join(projectDir, "src/index.css"),
            `@tailwind base;
@tailwind components;
@tailwind utilities;
`
          );
        },
      };

    case "bootstrap":
      return {
        runtime: ["bootstrap"],
        dev: [],
        setup: async (projectDir) => {
          const mainFile = path.join(projectDir, "src/main.jsx");
          let code = await fs.readFile(mainFile, "utf-8");
          if (!code.includes('bootstrap/dist/css/bootstrap.min.css')) {
            code = `import "bootstrap/dist/css/bootstrap.min.css";\n` + code;
            await fs.writeFile(mainFile, code);
          }
        },
      };

    case "mui":
      return {
        runtime: ["@mui/material", "@emotion/react", "@emotion/styled"],
        dev: [],
        setup: async (projectDir) => {
          // Provide a minimal MUI demo so users see it working
          const appFile = path.join(projectDir, "src/App.jsx");
          await fs.writeFile(
            appFile,
            `import { Button } from "@mui/material";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Hello from MUI</h1>
      <Button variant="contained">MUI Button</Button>
    </div>
  );
}
`
          );
        },
      };

    case "none":
    default:
      return { runtime: [], dev: [], setup: async () => {} };
  }
}

/* ---------------------------
   Extra libs dependency logic
---------------------------- */
function extraDeps(extra) {
  // extra is expected to be an array like ["axios","formik"] or ["none"]
  const deps = { runtime: [], dev: [] };
  if (!Array.isArray(extra)) return deps;
  if (extra.includes("none")) return deps;

  if (extra.includes("axios")) deps.runtime.push("axios");
  if (extra.includes("formik")) deps.runtime.push("formik");
  if (extra.includes("react-icons")) deps.runtime.push("react-icons");
  if (extra.includes("react-font")) deps.runtime.push("react-font");

  return deps;
}

/* ---------------------------
   Public API
---------------------------- */
export function pmRun(pm, script) {
  switch (pm) {
    case "yarn":
      return `yarn ${script}`;
    case "pnpm":
      return `pnpm ${script}`;
    case "bun":
      return `bun ${script}`;
    default:
      return `npm run ${script}`;
  }
}

export async function installDeps({ projectDir, pkgManager, uiLib, extraLib }) {
  const spinner = ora("Installing dependencies").start();

  try {
    // Ensure base install (so lockfile & node_modules exist)
    await run(pmInstallCmd(pkgManager), { cwd: projectDir });

    // UI library deps
    const ui = depsForUI(uiLib);
    if (ui.runtime.length) await addDeps(pkgManager, ui.runtime, projectDir, false);
    if (ui.dev.length) await addDeps(pkgManager, ui.dev, projectDir, true);

    // Extra libs
    const extra = extraDeps(extraLib);
    if (extra.runtime.length) await addDeps(pkgManager, extra.runtime, projectDir, false);
    if (extra.dev.length) await addDeps(pkgManager, extra.dev, projectDir, true);

    // Patch package.json defaults
    await patchPackageJson(projectDir, (pkg) => {
      pkg.name = pkg.name || path.basename(projectDir);
      pkg.scripts ||= {};
      pkg.scripts.dev ||= "vite";
      pkg.scripts.build ||= "vite build";
      pkg.scripts.preview ||= "vite preview";
      return pkg;
    });

    // Run UI-specific setup last (writes files)
    if (typeof ui.setup === "function") {
      await ui.setup(projectDir);
    }

    spinner.succeed("Dependencies installed & UI configured");
  } catch (e) {
    spinner.fail("Failed to install dependencies");
    console.error(e);
    process.exit(1);
  }
}

/* ---------------------------
   Internals
---------------------------- */
function pmInstallCmd(pm) {
  switch (pm) {
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm install";
    case "bun":
      return "bun install";
    default:
      return "npm install";
  }
}

async function addDeps(pm, list, cwd, dev) {
  if (!list.length) return;
  const args = dev ? devArg(pm) : prodArg(pm);
  const cmd = `${pm} ${args} ${list.join(" ")}`.trim();
  await run(cmd, { cwd });
}

function prodArg(pm) {
  switch (pm) {
    case "npm":
      return "install";
    case "pnpm":
      return "add";
    case "yarn":
      return "add";
    case "bun":
      return "add";
    default:
      return "install";
  }
}

function devArg(pm) {
  switch (pm) {
    case "npm":
      return "install -D";
    case "pnpm":
      return "add -D";
    case "yarn":
      return "add -D";
    case "bun":
      return "add -d";
    default:
      return "install -D";
  }
}

async function patchPackageJson(projectDir, mutate) {
  const pkgPath = path.join(projectDir, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
  const next = mutate(pkg) || pkg;
  await fs.writeFile(pkgPath, JSON.stringify(next, null, 2) + "\n", "utf-8");
}

async function run(cmd, opts) {
  const [bin, ...args] = splitCmd(cmd);
  await execa(bin, args, { stdio: "inherit", ...opts });
}

function splitCmd(s) {
  const parts = s.split(" ").filter(Boolean);
  return [parts[0], ...parts.slice(1)];
}
