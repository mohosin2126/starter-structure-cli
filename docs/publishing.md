# Publishing

This repository publishes two npm packages:

- `starter-structure-cli` for `npx starter-structure-cli ...`
- `create-starter-structure-cli` for `npm create starter-structure-cli ...`

The main package is published from the generated `templates/` output, so release validation should always rebuild and verify templates first.

## Pre-Publish Checklist

Run these commands before publishing manually:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:create-package
npm run check:templates
npm run check:publish-version
npm run check:publish-version -- ./packages/create-starter-structure-cli/package.json
npm pack --dry-run
```

## Script Notes

- `npm run build:architecture-stubs` prepares architecture layer stubs
- `npm run build:templates` composes `template-sources/` into `templates/`
- `npm run check:create-package` verifies that the `create-starter-structure-cli` wrapper stays version-aligned with the main package
- `npm run check:templates` ensures generated templates are not empty
- `npm run check:publish-version` prevents publishing an already-used npm version
- `npm pack --dry-run` shows the final package contents before release

## npm Publish Behavior

The repository uses:

- `prepack` to rebuild and validate templates before packaging
- `prepublishOnly` to verify the package version before publishing

## GitHub Actions Release Flow

The publish workflow lives in `.github/workflows/publish.yml`.

It runs when:

- a tag matching `v*` is pushed
- the workflow is triggered manually

The current workflow publishes the main `starter-structure-cli` package.

If you also want to publish `create-starter-structure-cli` from GitHub Actions, add a second publish path for `./packages/create-starter-structure-cli` and run the wrapper-specific publish checks before that step.

The current workflow:

1. checks out the repository
2. installs dependencies with `npm ci`
3. validates templates
4. checks the main package publish version
5. publishes `starter-structure-cli`

Publishing from GitHub Actions requires a valid `NPM_TOKEN` secret.
