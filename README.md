# React + Vite

Esta plantilla ofrece una configuración mínima para hacer que React funcione en Vite con HMR (recarga en caliente) y algunas reglas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

-@vitejs/plugin-react usa Babel (o oxc cuando se usa en rolldown-vite) para Fast Refresh.(https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)

-@vitejs/plugin-react-swc usa SWC para Fast Refresh.(https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)

## Compilador de React

El Compilador de React no está habilitado en esta plantilla debido a su impacto en el rendimiento durante el desarrollo y la construcción del proyecto.
Para agregarlo, revisa esta documentación.(https://react.dev/learn/react-compiler/installation).

## Ampliar la configuración de ESLint

Si estás desarrollando una aplicación para producción, se recomienda usar TypeScript con reglas de linting basadas en tipos.(https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
Consulta la plantilla de React + TypeScript para aprender cómo integrar TypeScript y typescript-eslint (https://typescript-eslint.io) en tu proyecto.
