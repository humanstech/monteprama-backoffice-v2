# Tech stack
The tech stack is built on the latest stable version of React, using Vite as the build tool and Tailwind CSS for styling.  
This core stack is complemented by widely adopted libraries considered industry standards, such as React Router for routing, Shadcn for UI components, Zustand for state management, and React Query for asynchronous data handling and caching.  
This combination ensures a modern, efficient, and maintainable development environment.

## How to start
```shell
nvm use # Only the first time
pnpm install # Whenever the package.json changes
pnpm dev
```

## Naming convention
* All the .js, .jsx, .ts, .tsx, .css, .json files and folders must be in kebab case (e.g., `my-file.tsx`);
* All the React components, types and schemas must be in upper camel case (e.g., `MyComponent`, `MyType`);
* All the functions, variables and frontend values must be in camel case (e.g., `myFunc`);
* All the static constants must be in upper snake case (e.g., `MY_CONSTANT`);
* The translation JSON keys must be in snake case (e.g., `my_key`);
* The types derived from a schema must have the same name as their schema;
* The http functions and related hooks must have one of the following prefixes: get, store, update, delete (e.g., `httpGetUsers`, `useGetUsers`).

## Scaffolding
The proposed folder structure is organized to promote scalability, modularity, and maintainability.  
At the root of the **`src`** directory, we have:
* **`assets`**: this folder contains all static resources such as images, videos, fonts, and icons;
* **`components`**: this includes reusable components across features and is divided into two main sections:
  * **`ui`**: this includes atomic and primitive components that form the base of the design system;
  * **`commons`**: these are higher-level, reusable components that are composed using the UI primitives.
* **`features`**: domain-specific modules organized by business capability (e.g., `users`, `auth`, `products`). A feature folder contains:
  * * **`components`**: specific components to this feature domain;
  * **`hooks`**: custom hooks related to feature functionality;
  * **`http`**: API integration and data fetching functions (e.g., `users.http.ts`);
  * **`queries`**: React Query hooks for data fetching and mutations (e.g., `use-get-users.ts`);
  * **`stores`**: state management stores (Zustand);
  * **`constants.ts`**: feature-specific constants and fixed values;
  * **`types.ts`**: TypeScript type definitions and Zod schemas (except forms) for this feature;
  * **`form-schemas.ts`**: validation schemas for forms;
  * **`utils.ts`**: helper functions specific to this feature;
  * Optional other sub-features structured like main features.
* **`helpers`**: a folder that contains utility functions and helper methods used across the application;
* **`types.ts`**: global TypeScript types and declarations;
* **`constants.ts`**: application-wide constants and configuration values;
* **`utils.ts`**: shared utility functions used across the application.
* **`hooks`**: application-wide custom hooks not tied to a specific feature;
* **`layouts`**: page layout templates (e.g., private layout, public layout);
* **`pages`**: route components (e.g., `home.tsx`);
* **`route-guards`**: components for route protection and navigation control;
* **`translations`**: internationalization files and i18n config. [Read more](#translations);
* **`types`**: a folder that contains packages declaration types;
* **`App.tsx`**: root component on top of the application;
* **`axios.ts`**: axios instance configuration and interceptors;
* **`dates.ts`**: common date utilities;
* **`env-vars.ts`**: environment variables type definitions and validation;
* **`main.tsx`**: application entry point with React rendering setup and providers;
* **`query-client.ts`**: React Query client configuration;
* **`router.tsx`**: router configuration with route definitions;
* **`theme.css`**: global CSS variables and theme definitions;
* **`vite-env.d.ts`**: Vite environment type declarations.

### FAQ
**_Where should I put a component used in more features?_**  
If the component is related to a specific entity should be put in its feature (e.g, `users-table.tsx` should be put in the `users` feature even if another feature uses it), else in `components/commons`.

**_Where should I put an http function/query/mutation used in more features?_**  
If the http function/query/mutation is related to a specific entity should be put in its feature (e.g, `use-get-users.ts` should be put in the `users` feature even if another feature needs it), else in a new `src/http|queries folder`.

# UI
The UI is combined with Tailwind CSS and Shadcn for modern, consistent, and  AI-driven elements to deliver dynamic, personalized, and efficient user interactions.

## Shadcn components
### Installation
1. Find the component in the Shadcn docs;
2. Search the Installation section;
3. Use the command in the CLI and pnpm tabs;
4. If it installs an icon library remove it and use our icons;
5. Don't rename the file nor the variables inside the file;
6. Add the docs in the file.

### Editing guidelines
* Edit only the bare essentials (often you just need to edit the classNames);
* If you need to add a sub-component use the same standard as the existing ones;
* Remove all the dark classes;
* Update the docs in the file if needed.

### Updating guidelines
Updating a component means reinstalling it through the CLI.  
To avoid overwriting it:
* Rename the current component by adding an underscore before (e.g. `Button` to `_Button`);
* Follow the Installation process above up to the 5th point;
* Transfer the custom `_Component` code into the new installed component;
* Update the docs in the file if needed.

### Docs
If you have an AI assistant in your IDE you might just need to add the my-component.tsx and the input.tsx files as context and prompt “Add docs in the `my-component.tsx` file like input.tsx”, then check if the generated docs are correct and exhaustive. Else you need to do it manually.

# Translations
Translations and internationalization are managed using the [i18n package](https://www.i18next.com/), providing a scalable and consistent approach for handling multiple languages with full TypeScript type safety.

## File Structure
The `src/translations` directory uses a namespace-based organization. Each locale folder contains multiple JSON files (namespaces) that group related translations:

```
src/translations/
├── en/
│   ├── common.json      # Shared strings (errors, date picker, etc.)
│   ├── auth.json        # Authentication feature strings
│   ├── users.json       # Users feature strings
│   └── en.ts            # Barrel export for type inference
├── it/
│   ├── common.json
│   ├── auth.json
│   ├── users.json
│   └── it.ts
└── i18n.tsx             # Configuration and type-safe exports
```

Non-default locales may have missing keys or files. Use `pnpm i18n:generate-missing` to see what translations are needed.

## Adding a New Namespace
1. Create the JSON file in the default language folder (e.g., `en/my-feature.json`);
2. Create the same file in other locale folders with translated values (or run `pnpm i18n:generate-missing` to see what's needed);
3. Update the barrel export in each locale's `<locale>.ts` file:
```typescript
// en/en.ts
import common from './common.json'
import myFeature from './my-feature.json'

export const en = {
  common,
  myFeature
} as const
```

## Type-Safe Usage
The `i18n.tsx` file provides type-safe wrappers with namespaced key access.

### useTranslation Hook
```typescript
const { t } = useTranslation()

t('common:http_errors.default') // ✅ Type-safe
t('auth:login.title')           // ✅ Type-safe
t('ui:date_picker.preset_today') // ✅ Type-safe
```

### Trans Component
```tsx
<Trans 
  i18nKey="common.welcome_message" 
  values={{ name: 'John' }} 
  components={{strong: <strong/>}}
/>
```

### Direct i18n Instance
For usage outside React components:
```typescript
import i18n from '@/translations/i18n'

i18n.t('common:http_errors.default')
```

**Important:** Always use the typed exports from `i18n.tsx` (`useTranslation`, `Trans`, `i18n`). Never use the original i18next functions directly as they lack type inference.

## JSON Structure Guidelines
Each namespace file should be organized with nested objects for logical grouping:
```json
{
  "http_errors": {
    "default": "Oops! Something went wrong.",
    "not_found": "Resource not found."
  },
  "actions": {
    "save": "Save",
    "edit": "Edit"
  }
}
```

* **common.json**: Shared strings used across multiple features (errors, UI labels, etc.);
* **Feature files** (e.g., `users.json`): Strings specific to that feature;

All keys must be in snake_case.

## Validation Scripts
Translation scripts are located in `scripts/i18n/` with shared utilities in `utils.js`. They run automatically via lint-staged when translation files are committed, or can be run manually:

### Sort Translation Keys
Sorts all keys and subkeys alphabetically in translation files:
```shell
pnpm i18n:sort-keys
```
This script automatically modifies files if keys are out of order.

### Check Duplicate Strings
Identifies duplicate strings that could be consolidated into `common`:
```shell
pnpm i18n:check-duplicates        # Check default language (en)
pnpm i18n:check-duplicates it     # Check specific locale
```

All duplicate strings (2+ occurrences) are reported as warnings.

### Generate Missing Translations
Generates `{locale}.{namespace}.json` files in `src/translations/missing/` showing what translations are needed:
```shell
pnpm i18n:generate-missing
```

For example, if Italian is missing keys in `common.json`, it generates `src/translations/missing/it.common.json` with the exact structure of the namespace, ready to be translated and merged. The output files are gitignored and serve as a reference for translators.

### Run All Validations
```shell
pnpm i18n:validate
```

This runs: sort keys → check duplicates.

# Best practices
## Types
### Avoid `any` and prefer `unknown`
Never use the `any` type, as it disables type checking and undermines the benefits of TypeScript.  
If you truly need a type that can accept any value, use `unknown` instead; `unknown` is safer because it requires explicit type checking before usage.

### Limit usage of `as`
Avoid using `as` for type assertions unless necessary; only use it when you are certain about the type and there is no alternative.  
Do not use type assertions to silence legitimate type errors.

### Use `ts-expect-error` for unresolvable errors
If a type error cannot be resolved objectively, use `@ts-expect-error` with the following format:
```typescript
// @ts-expect-error [TS001] this is my description
```


# Git flow
Our Git workflow is designed to ensure code quality and streamline deployments.  
Developers commit their changes to feature branches and open a pull request for review. Once approved, the PR is typically merged using the “Squash and merge” mode into the `develop` branch, which automatically triggers a deployment to the staging environment, and the branch should be deleted.  
To release changes to production, the updates are merged from `develop` into the `main` branch. Merging into `main` initiates the deployment process to the production environment.

## Branch naming
Branches should be named using only lowercase letters and hyphens, without any prefixes. Names should be descriptive and indicate the purpose of the branch (e.g., `login-page`, `improve-error-handling`, `responsive-sidebar`).

## Commit messages
Commit messages should follow the conventional commit standard, using prefixes such as `feat`, `fix`, `refactor`, `ops`, `docs`, `test`, `chore`, and `style`, followed by a concise and meaningful description of the change. Examples:
* feat: add login page;
* fix: correct header alignment;
* refactor: update user service logic;
* docs: update API documentation;
* test: add e2e tests for login;
* chore: update dependencies;
* style: fix code formatting.

Keep commit messages brief but informative, clearly describing the change made.
