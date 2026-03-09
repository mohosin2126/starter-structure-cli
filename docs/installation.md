# Installation

`starter-structure-cli` can be used directly with `npx` or developed locally from this repository.

## Requirements

- Node.js 18 or later
- npm 9 or later

## Use From npm

Run the CLI without installing it globally:

```bash
npx starter-structure-cli my-app
```

Or install it globally:

```bash
npm install -g starter-structure-cli
starter-structure-cli my-app
```

## Local Repository Setup

Install dependencies:

```bash
npm install
```

Verify the CLI is available:

```bash
node ./bin/starter-structure-cli.js --help
```

Build generated templates from `template-sources`:

```bash
npm run build:architecture-stubs
npm run build:templates
```

Validate generated templates:

```bash
npm run check:templates
```

The package automatically rebuilds templates during `npm pack` through the `prepack` script.
