# Agent Guidelines for CyberAware Frontend Repository

This document outlines the essential commands and code style guidelines for agentic coding agents operating within this repository.

## 1. Build/Lint/Type-Check Commands

- **Install Dependencies**: `pnpm install --frozen-lockfile`
- **Build**: `pnpm build` (runs `next build`)
- **Lint (ESLint)**: `pnpm lint:eslint` (runs `eslint . --max-warnings 0`)
- **Format (Prettier)**: `pnpm lint:format` (runs `prettier --write .`)
- **Type Check**: `pnpm lint:type-check` (runs `tsc --pretty -p tsconfig.json`)

**Running a single test**: No explicit test commands or dedicated testing framework configuration were found in `package.json` or CI/CD workflows. If unit tests exist, they are likely run through a custom script or a framework like Jest/React Testing Library. Agents should search for `.test.ts` or `.spec.ts` files and infer the testing command if needed.

## 2. Code Style Guidelines

This project adheres to code style guidelines enforced by `@zayne-labs/eslint-config` and `@zayne-labs/prettier-config`. Agents should ensure all code modifications comply with these configurations.

- **Imports**: Follow the import ordering and conventions enforced by ESLint.
- **Formatting**: Adhere to Prettier's formatting rules. Run `pnpm lint:format` to automatically format code.
- **Types**: TypeScript is used extensively. Ensure all new code is strongly typed and existing types are respected.
- **Naming Conventions**: Follow established naming conventions for variables, functions, components, and files as dictated by the ESLint configuration.
- **Error Handling**: Implement robust error handling mechanisms consistent with existing patterns in the codebase.

No Cursor or Copilot specific rules were found in the repository.
