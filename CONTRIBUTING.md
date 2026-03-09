# Contributing

Thanks for contributing to `starter-structure-cli`.

This repository is focused on a template-driven scaffolding CLI. Changes should keep the public package easy to understand, safe to publish, and straightforward to extend with new starters.

## Before You Start

Please keep these guardrails in mind:

- prefer small, review-friendly pull requests
- keep the CLI, template builder, and template source changes clearly scoped
- treat `template-sources/` as the source of truth and `templates/` as generated output
- avoid adding hidden magic that makes template matching harder to reason about

## Local Setup

Requirements:

- Node.js 18 or later
- npm 9 or later

Install dependencies:

```bash
npm install
```

Build generated assets:

```bash
npm run build:architecture-stubs
npm run build:templates
```

Run validation:

```bash
npm run check:templates
node ./bin/starter-structure-cli.js --help
```

Useful scripts:

- `npm run build:architecture-stubs`
- `npm run build:templates`
- `npm run check:templates`
- `npm run check:publish-version`
- `npm run stats:downloads`

## Coding Expectations

When making changes:

- update docs when CLI behavior, matching rules, or template layout changes
- update `template-sources/` first when adding or fixing starter content
- rebuild `templates/` after changing presets, layers, bases, or shared components
- keep README snippets and generated template README files consistent where possible

## Commit Guidance

Preferred prefixes:

- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `test:`
- `chore:`

Examples:

- `feat: add postgres fullstack starter preset`
- `fix: prefer ts template when both language variants match`
- `docs: split publishing steps into dedicated guide`

## Pull Request Checklist

Before opening a pull request:

1. run `npm run build:architecture-stubs`
2. run `npm run build:templates`
3. run `npm run check:templates`
4. verify the CLI help and README examples still match actual behavior
5. update docs if the public workflow changed

## Scope Notes

Good contributions include:

- new starter combinations that fit the existing template model
- clearer template authoring workflows
- better CLI matching and selection behavior
- documentation and publishing improvements

Please avoid:

- unrelated framework experiments without a matching preset strategy
- manual edits inside generated `templates/` that are not backed by `template-sources/`
- release changes that skip template validation
