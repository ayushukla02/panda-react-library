# Panda React

🚀 A simple CLI tool to bootstrap modern React + Vite projects with your choice of UI framework.

## ✨ Features
- ⚡ Blazing fast React + Vite setup
- 🎨 Supports Tailwind, Bootstrap, and Material UI (MUI)
- 🔧 Auto-configures tailwind.config.js and postcss.config.js for Tailwind
- 📂 Pre-defined folder structure

## Folder structure
```plaintext
my-app/
  ├── src/
  │   ├── components/
  │   │   ├── pages/
  │   │   ├── hooks/
  │   ├── utils/
  │   ├── assets/
  │   ├── App.jsx
  │   ├── main.jsx
  │   ├── index.css
  ├── package.json
  ├── vite.config.js
  └── README.md
```

## Installation
```bash
npm install -g panda-react
```

## Create a new project (auto configure CSS libraries)
```bash
# Using npx (no global install needed)
npx panda-react my-app --ui tailwind
npx panda-react my-app --ui bootstrap
npx panda-react my-app --ui mui
npx panda-react my-app --ui none

# Or, if installed globally:
panda-react my-app --ui tailwind
```

## Running the app
```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## Contributing
Feel free to contribute to this project.

## License
MIT License © 2023 [Ayush](https://github.com/ayushukla02)






