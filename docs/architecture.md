# Architecture

This repository ships generated templates in `templates/`, but the source of truth lives in `template-sources/`.

## Repository Layout

```text
bin/                  Published CLI entry point
lib/                  Template build helpers
scripts/              Build, validation, publish, and stats utilities
template-sources/     Source material for generated templates
templates/            Built templates consumed by the CLI
docs/                 Public project documentation
```

## Template Source Model

`template-sources/` is organized into four layers:

```text
template-sources/
  bases/
  layers/
  presets/
  components/
```

What each part does:

- `bases/` contains starter foundations for each category
- `layers/` adds optional structure, language variants, or opinionated project slices
- `presets/` defines how bases and layers are combined into final output templates
- `components/` stores reusable text snippets, styles, and package fragments

## Build Flow

Template generation is driven by `lib/template-builder.js`.

At build time the generator:

1. loads preset definitions from `template-sources/presets/`
2. clears the matching output directory in `templates/`
3. copies each referenced base into the target
4. overlays each referenced layer
5. replaces variables like `__APP_NAME__`
6. resolves `{{ include: ... }}` directives in text files
7. writes `.templates-manifest.json` so the CLI can detect when templates are current

## Includes And Variables

Text files support reusable includes:

```text
{{ include: components/readme/getting-started-vite.md }}
{{ include: ./shared-snippet.md }}
```

Variables use double-underscore placeholders:

```text
__APP_NAME__
__LANGUAGE__
__TEMPLATE_NAME__
```

Includes can point to a shared component path or a path relative to the file using it.

## Generated Output Categories

The current output categories are:

- `backend-only`
- `frontend-only`
- `fullstack`
- `monorepo-client-server`
- `monorepo-turbo-pnpm`
- `single`

Presets are the place to add or adjust final shipped template combinations.
