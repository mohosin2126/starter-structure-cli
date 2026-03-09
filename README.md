# starter-structure-cli

Scaffold starter projects from stack combinations like `react vite ts tailwind express prisma mysql`.

`starter-structure-cli` supports direct template selection, interactive prompts, and natural stack queries. It ships with frontend, backend, fullstack, and monorepo starters built from layered template sources.

## Installation

Run with `npx`:

```bash
npx starter-structure-cli my-app
```

Or install globally:

```bash
npm install -g starter-structure-cli
starter-structure-cli my-app
```

More setup details are available in [docs/installation.md](docs/installation.md).

## Quick Start

Interactive mode:

```bash
npx starter-structure-cli my-app
```

Exact template:

```bash
npx starter-structure-cli my-app --template fullstack/react-vite-ts-tailwind-express-prisma-mysql
```

Stack tokens:

```bash
npx starter-structure-cli my-app react vite ts tailwind express prisma mysql
```

List templates:

```bash
npx starter-structure-cli --list
```

## Repository Structure

```text
bin                 CLI entry point
lib                 Template build helpers
scripts             Build, validation, stats, and publish utilities
template-sources    Bases, layers, presets, and reusable components
templates           Generated templates used by the CLI
docs                Public project documentation
```

## Documentation

- [Installation](docs/installation.md)
- [CLI Guide](docs/cli.md)
- [Architecture](docs/architecture.md)
- [Templates](docs/templates.md)
- [Publishing](docs/publishing.md)
- [Roadmap](ROADMAP.md)
- [Contributing](CONTRIBUTING.md)

## Local Development

Useful commands:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:templates
node ./bin/starter-structure-cli.js --list
```

For template changes, update `template-sources/` first and then rebuild `templates/`.

## Usage Stats

npm does not provide unique user counts, but download counts are available:

```bash
npm run stats:downloads
```

## Links

- GitHub: [https://github.com/mohosin2126/starter-structure-cli](https://github.com/mohosin2126/starter-structure-cli)
- Issues: [https://github.com/mohosin2126/starter-structure-cli/issues](https://github.com/mohosin2126/starter-structure-cli/issues)

## License

MIT
