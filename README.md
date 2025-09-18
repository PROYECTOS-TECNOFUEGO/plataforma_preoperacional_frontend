# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

```
rplataformapreoperacional
├─ public //Aqui se añaden los recursos publicos
│  └─ vite.svg
├─ src //Carpeta principal con el codigo fuente
│  ├─ _constants
│  │  └─ formOptions.ts
│  ├─ assets
│  │  ├─ Backlogin.png
│  │  ├─ logo.png
│  │  ├─ LogoTecno.png
│  │  └─ react.svg
│  ├─ components // En esta carpeta se añaden los componentes
│  │  ├─ Dashboard
│  │  │  ├─ FiltersBar.tsx
│  │  │  ├─ KpiCard.tsx
│  │  │  ├─ TimeSeries.tsx
│  │  │  └─ TopBars.tsx
│  │  ├─ Form
│  │  │  ├─ CamposGrid.tsx
│  │  │  ├─ FormInspeccion.tsx
│  │  │  └─ FormStepper.tsx
│  │  ├─ Layout
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ Layout.tsx
│  │  │  └─ Sidebar.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ LoadingBackdrop.tsx
│  │  ├─ PageContainer.tsx
│  │  ├─ PageHeader.tsx
│  │  └─ SnackbarProvider.tsx
│  ├─ context
│  │  └─ AuthContext.tsx
│  ├─ graphql
│  │  └─ usuarios.ts
│  ├─ routes
│  │  └─ AppRoutes.tsx
│  ├─ theme
│  │  └─ theme.ts
│  ├─ utils
│  │  └─ Form
│  │     ├─ formReducer.ts
│  │     ├─ formState.ts
│  │     └─ validators.ts
│  ├─ views //Vistas generales del aplicativo
│  │  ├─ Dashboard.tsx
│  │  ├─ Form.tsx
│  │  ├─ Login.tsx
│  │  ├─ NoAutorizado.tsx
│  │  ├─ Principal.tsx
│  │  ├─ Reportes.tsx
│  │  ├─ Usuarios.tsx
│  │  └─ Vehiculos.tsx
│  ├─ .env // Variables de entorno
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
