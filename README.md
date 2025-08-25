# 🐼 Panda React

<p align="center">
  🚀 A simple CLI tool to bootstrap modern <b>React + Vite</b> projects with your choice of UI framework.
</p>

To create a new React project, run the command in your terminal:

```bash
npx panda-react create app
````

After the project is created, navigate into the directory and start the development server:

```bash
cd <your-project-name>
npm install
npm run dev
```

## ✨ Features

  - ✅ **Blazing Fast:** Built on top of Vite for a lightning-fast development experience.
  - 🎨 **UI Frameworks:** Integrated support for Tailwind CSS, Bootstrap, and Material UI (MUI).
  - 🔧 **Auto-Configuration:** Automatically configures `tailwind.config.js` and `postcss.config.js` when you choose Tailwind.
  - 📂 **Clean Structure:** Generates a pre-defined, scalable folder structure for your project.

## 🎨 Choosing a UI Framework

You can specify a UI framework using the `--ui` flag when creating your project.

```bash
npx panda-react create my-app --ui <framework>
```

The available framework options are:

  - `tailwind` 
  - `bootstrap`
  - `mui`
  - `none`

**Examples:**

```bash
# Create a project with Tailwind CSS
npx panda-react create my-tailwind-app --ui tailwind

# Create a project with Material UI
npx panda-react create my-mui-app --ui mui

# Create a project with no pre-installed UI framework
npx panda-react create my-vanilla-app --ui none
```

## 📂 Project Structure

Your new project will have a clean and organized folder structure:

```
my-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 📜 Available Scripts

Inside the project directory, you can run the following commands:

  - `npm run dev` — Starts the development server.
  - `npm run build` — Builds the app for production.
  - `npm run preview` — Previews the production build locally.

## 🤖 CI/CD with GitHub Actions

This project uses GitHub Actions for continuous integration and deployment.

  - ✅ **Quality Checks:** Runs linters and tests on every push and pull request.
  - 📦 **Auto Publish:** Automatically publishes a new version to npm when a release is created on GitHub.

## 🤝 Contributing

Contributions are welcome\! If you'd like to help improve Panda React, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/my-awesome-feature`).
3.  Commit your changes (`git commit -m 'Add some awesome feature'`).
4.  Push to the branch (`git push origin feature/my-awesome-feature`).
5.  Open a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ayushukla02/panda-react/blob/main/LICENSE) file for details.
<br/>
<p align="center">Made with ❤️ by Ayush</p>
