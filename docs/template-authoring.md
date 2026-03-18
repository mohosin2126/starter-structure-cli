# Template Authoring

`starter-structure-cli` builds published starters from `template-sources/`.

## Source model

The repository uses four source concepts:

- `bases/`
  Starter foundations that can already stand on their own. These usually contain the shared root files and the primary app structure for a stack.
- `layers/`
  Optional overlays that add language variants, architecture slices, or feature-specific additions. Recently touched areas now also use concern-based folders such as `layers/feature/shadcn/` and `layers/language/typescript/`.
- `presets/`
  The shipped catalog definitions. A preset chooses one or more bases and layers, then writes the final output into `templates/<category>/<slug>`.
- `components/`
  Reusable include snippets for package fragments, README sections, and shared styles.

## How composition works

At build time the template generator:

1. loads preset definitions from `template-sources/presets/`
2. validates preset references and output consistency
3. clears and rebuilds the generated `templates/` directory
4. copies each referenced base into the preset output
5. overlays each referenced layer in order
6. resolves `{{ include: ... }}` references in text files
7. replaces placeholders such as `__APP_NAME__`
8. writes `templates/.templates-manifest.json`

Later layers win when they overwrite files from earlier layers.

## Adding a new starter

Recommended workflow:

1. Choose the category and final slug.
   Example: `fullstack/react-vite-ts-shadcn-express-prisma-postgres`
2. Decide whether the starter needs:
   - a new base
   - a new feature layer
   - a new language layer
   - only a new preset that reuses existing parts
3. Create or reuse source folders under `template-sources/`.
4. Add the preset JSON under `template-sources/presets/<category>/<slug>.json`.
5. Keep preset naming aligned:
   - preset file name should match `preset.name`
   - `preset.output` should be `templates/<category>/<slug>`
   - the output slug should match `preset.name`
6. Rebuild templates and run validation.
7. Check CLI discovery with `--list`.
8. Scaffold at least one sample project from the new template.

## Choosing bases vs layers

Use a base when:

- the root structure is materially different
- the client/server app shape changes
- the starter needs a new shared foundation

Use a layer when:

- the change is language-specific
- the change is a reusable feature slice
- the same enhancement should be composable across multiple starters

Use the concern-based layer folders for newly touched areas when it keeps reuse clearer:

- `template-sources/layers/feature/...`
- `template-sources/layers/language/javascript/...`
- `template-sources/layers/language/typescript/...`

## Includes and placeholders

Text files can include reusable fragments:

```text
{{ include: components/readme/getting-started-prisma.md }}
{{ include: ./local-snippet.md }}
```

Placeholders use double underscores:

```text
__APP_NAME__
__LANGUAGE__
```

## Rebuild templates

Run:

```bash
npm run build:architecture-stubs
npm run build:templates
```

`build:architecture-stubs` is only needed when you change the generated architecture stub sources.

## Validate templates

Run:

```bash
npm run check:templates
```

The validation step now checks:

- referenced base and layer paths exist
- preset output paths match preset names
- duplicate preset outputs do not exist
- every preset output directory exists after build
- every built template contains a `README.md`
- every built template contains a package/app signal such as `package.json`
- generated template directories are not empty

## Useful release checks

Common verification commands:

```bash
node ./bin/starter-structure-cli.js --list
node ./bin/starter-structure-cli.js demo-app --template backend-only/fastify-prisma-postgres-ts
node ./bin/starter-structure-cli.js demo-app --template single/nextjs-ts-shadcn-tailwind
npm pack --dry-run
```
