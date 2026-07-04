# Contributing to MCloud SaaS

> **Thank you for considering contributing to this project!**

## Table of Contents
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Coding Style & Linting](#coding-style--linting)
- [Commit Messages](#commit-messages)
- [Pull Request Workflow](#pull-request-workflow)
- [Testing](#testing)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Getting Started
1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your‑username>/mcloud-saas.git
   cd mcloud-saas
   ```
3. **Create a new branch** for your work (use a descriptive name):
   ```bash
   git checkout -b feat/awesome‑feature
   ```

## Development Environment
- **Node.js**: v20 LTS (or later). Use `nvm` to manage versions.
- **Docker & Docker‑Compose**: required for local micro‑service orchestration.
- **PM2**: optional for running services outside Docker during quick tests.
- **Install dependencies**:
  ```bash
  npm install
  ```
- **Start the stack** (Docker compose for all services):
  ```bash
  docker compose up -d
  ```
- **Run the frontend**:
  ```bash
  npm run dev   # Vite dev server (http://localhost:5173)
  ```

## Coding Style & Linting
- Use **Prettier** and **ESLint** – they are already configured.
- Run the formatter before committing:
  ```bash
  npm run format
  ```
- Lint errors must be fixed before opening a PR:
  ```bash
  npm run lint
  ```

## Commit Messages
We follow **Conventional Commits**. Example:
```
feat(auth): add JWT refresh endpoint
fix(payment): correct Midtrans callback URL handling
docs: update README with production guide link
```

## Pull Request Workflow
1. Push your branch to your fork:
   ```bash
   git push origin feat/awesome‑feature
   ```
2. Open a **Pull Request** against the `master` (or `main`) branch.
3. The PR title should mirror your commit message (prefixed with the type).
4. Ensure that **CI** passes – the tests and linting will run automatically.
5. Request review from at least one maintainer.
6. Once approved, the maintainer will **squash‑merge** the PR.

## Testing
- Unit tests are written with **Jest**. Run them with:
  ```bash
  npm test
  ```
- Integration tests for Docker services can be run via:
  ```bash
  npm run test:integration
  ```
- Add tests for any new functionality or bug fix.

## Issue Reporting
- Use the **GitHub Issues** tab.
- Provide:
  - A clear title.
  - Steps to reproduce (if a bug).
  - Expected vs. actual behavior.
  - Screenshots or logs when relevant.
- Tag the issue with `bug`, `enhancement`, or `question`.

## Code of Conduct
We adhere to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to follow its guidelines.

## License
By contributing, you agree that your contributions will be licensed under the project's **MIT License**.

---
*Happy coding!*
