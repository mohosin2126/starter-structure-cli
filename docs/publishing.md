# Publishing

This package is published from the generated `templates/` output, so release validation should always rebuild and verify templates first.

## Pre-Publish Checklist

Run these commands before publishing manually:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:templates
npm run check:publish-version
npm pack --dry-run
```

## Script Notes

- `npm run build:architecture-stubs` prepares architecture layer stubs
- `npm run build:templates` composes `template-sources/` into `templates/`
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

The workflow:

1. checks out the repository
2. installs dependencies with `npm ci`
3. validates templates
4. checks the publish version
5. runs `npm publish`

Publishing from GitHub Actions requires a valid `NPM_TOKEN` secret.
