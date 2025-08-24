import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { applyTweaks } from "./tweaks.js";
import { installDeps, pmRun } from "./pm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp({ projectName, uiLib, extraLib, useGit, pkgManager = "npm" }) {
  const projectDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(projectDir)) {
    console.error(
      chalk.red(`\n❌ Directory ${projectName} already exists. Choose another name or remove it.`)
    );
    process.exit(1);
  }

  const spinner = ora("Scaffolding Vite + React app").start();
  try {
    await execa("npm", ["create", "vite@latest", projectName, "--", "--template", "react"], {
      stdio: "ignore",
    });
    spinner.succeed("Vite app created");
  } catch (err) {
    spinner.fail("Failed to scaffold with create-vite");
    console.error(err);
    process.exit(1);
  }

  // Clean boilerplate and set structure
  await applyTweaks({ projectDir, uiLib, extraLib });

  // Install dependencies + configure chosen UI
  await installDeps({ projectDir, pkgManager, uiLib, extraLib });

  // Git init (optional)
  if (useGit) {
    try {
      await execa("git", ["init"], { cwd: projectDir });
      await execa("git", ["add", "."], { cwd: projectDir });
      await execa("git", ["commit", "-m", "chore: bootstrap project with panda-react"], {
        cwd: projectDir,
      });
      console.log(chalk.green("\n✔ Initialized git repository"));
    } catch {
      console.log(chalk.yellow("\n⚠ Git not initialized (skipped)"));
    }
  }

  // Final instructions
  console.log("\n" + chalk.bold("Next steps:"));
  console.log(` ${chalk.cyan("cd")} ${projectName}`);
  console.log(` ${chalk.cyan(pmRun(pkgManager, "dev"))}`);
  console.log("\nHappy Developing with 🐼 React !✨\n");
}
