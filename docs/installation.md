# Installation

`starter-structure-cli` can be used with `npx`, the standard `npm create` flow, or developed locally from this repository.

## Requirements

- Node.js 18 or later
- npm 9 or later

## Use From npm

Run the CLI without installing it globally:

```bash
npx starter-structure-cli my-app
```

Run it with the npm create convention:

```bash
npm create starter-structure-cli@latest my-app
```

Or install it globally:

```bash
npm install -g starter-structure-cli
starter-structure-cli my-app
```

If you run `npm install starter-structure-cli`, npm will only install the package into the current directory. It will not execute the scaffolder for you.

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
npm run check:create-package
```

Validate generated templates:

```bash
npm run check:templates
```

The package automatically rebuilds templates during `npm pack` through the `prepack` script.
