import path from "node:path";
import fs from "fs-extra";

export async function applyTweaks({ projectDir, uiLib, extraLib }) {
  // Remove default Vite assets
  const toRemove = [
    path.join(projectDir, "src", "assets", "react.svg"),
    path.join(projectDir, "public", "vite.svg"),
  ];
  for (const f of toRemove) await fs.remove(f).catch(() => {});

  const appPath = path.join(projectDir, "src", "App.jsx");
  const mainPath = path.join(projectDir, "src", "main.jsx");
  const indexCss = path.join(projectDir, "src", "index.css");

  // Helpers
  const hasExtra = (name) => Array.isArray(extraLib) && extraLib.includes(name);

  // Base App.jsx
  let appContent = `export default function App() {
  return (
    <div className="app-wrap">
      <h1>Welcome to Panda React by Ayush😊</h1>
      <p>Edit src/components/pages/Home.jsx and start building!
       🚀 - pls remove this wrapper div</p>
    </div>
  );
}
`;

  // React Icons example
  const mainImports = [];
  if (hasExtra("react-icons")) {
    mainImports.push("import { FaBeer } from 'react-icons/fa';");
    appContent = appContent.replace(
      `    <div className="app-wrap">`,
      `    <div className="app-wrap">
      <p>Example Icon: <FaBeer /></p>`
    );
  }

  // React Font example
  if (hasExtra("react-font")) {
    mainImports.push("import { GoogleFont } from 'react-font';");
    appContent = `export default function App() {
  return (
    <div className="app-wrap">
      <GoogleFont font='Roboto' />
      <h1>Welcome to Panda React by Ayush 😊</h1>
      <p>Edit src/components/pages/Home.jsx and start building! 🚀</p>
    </div>
  );
}
`;
  }

  // main.jsx — only UI-agnostic baseline here.
  // (Bootstrap CSS import is injected by pm.js; MUI demo App is written by pm.js)
  const mainTemplate = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
${mainImports.join("\n")}
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  await fs.writeFile(appPath, appContent, "utf-8");
  await fs.writeFile(mainPath, mainTemplate, "utf-8");

  // Minimal CSS (Tailwind will overwrite via pm.js if chosen)
  await fs.writeFile(
    indexCss,
    "/* Base styles. Tailwind will overwrite this if enabled. */\n*{box-sizing:border-box} body{margin:0;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif}\n",
    "utf-8"
  );

  // Create requested folder structure
  const dirs = [
    path.join(projectDir, "src", "components", "pages"),
    path.join(projectDir, "src", "components", "hooks"),
    path.join(projectDir, "src", "utils"),
    path.join(projectDir, "src", "assets"),
  ];
  for (const d of dirs) await fs.mkdirp(d);

  // Minimal starter files
  await fs.writeFile(
    path.join(projectDir, "src", "components", "pages", "Home.jsx"),
    `export default function Home(){return <div style={{padding:16}}>Home Page</div>}`,
    "utf-8"
  );

  // Extra library helper files
  if (hasExtra("axios")) {
    await fs.writeFile(
      path.join(projectDir, "src", "utils", "axios.js"),
      `import axios from 'axios'
export const api = axios.create({ baseURL: 'https://api.example.com', timeout: 10000 })
export default api
`,
      "utf-8"
    );
  }

  if (hasExtra("formik")) {
    await fs.writeFile(
      path.join(projectDir, "src", "components", "hooks", "useSimpleForm.js"),
      `import { useFormik } from 'formik'
export function useSimpleForm(onSubmit){
  return useFormik({ initialValues:{ name:'' }, onSubmit })
}
`,
      "utf-8"
    );
  }
}
