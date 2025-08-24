#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { createApp } from "../src/createApp.js";

(async function run() {
  console.log(chalk.cyan("\n🚀 Welcome dev to panda🐼-react🫡\n"));

  const answers = await inquirer.prompt([
    {
      name: "projectName",
      type: "input",
      message: "Project name:",
      default: "my-panda-app",
      validate: (v) =>
        /^[a-zA-Z0-9-_]+$/.test(v)
          ? true
          : "Use only letters, numbers, hyphen, underscore",
    },
    {
      name: "uiLib",
      type: "list",
      message: "Choose a UI library (one):",
      choices: [
        { name: "TailwindCSS", value: "tailwind" },
        { name: "Bootstrap", value: "bootstrap" },
        { name: "MUI (Material UI)", value: "mui" },
        { name: "None", value: "none" },
      ],
    },
    {
      name: "extraLib",
      type: "checkbox",
      message: "Choose extra Libraries (select all that apply):",
      choices: [
        { name: "None", value: "none", checked: true },
        { name: "Axios", value: "axios" },
        { name: "React Icons", value: "react-icons" },
        { name: "React Font", value: "react-font" },
        { name: "Formik", value: "formik" },
      ],
    },
    {
      name: "useGit",
      type: "confirm",
      message: "Initialize a git repository?",
      default: true,
    },
  ]);

  const { projectName, uiLib, extraLib, useGit } = answers;

  // If user selected "none" plus others, strip "none"
  const normalizedExtras =
    extraLib.includes("none") && extraLib.length > 1
      ? extraLib.filter((lib) => lib !== "none")
      : extraLib;

  const pkgManager = "npm";

  await createApp({
    projectName,
    uiLib,
    extraLib: normalizedExtras,
    pkgManager,
    useGit,
  });
})();
