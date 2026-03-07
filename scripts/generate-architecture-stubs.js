import fs from "node:fs";
import path from "node:path";

const architectureRoot = path.resolve("template-sources/layers/architecture");

function walkIndexFiles(dirPath, collected = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkIndexFiles(entryPath, collected);
      continue;
    }

    if (entry.name === "index.tsx") {
      collected.push(entryPath);
    }
  }

  return collected;
}

function splitWords(value) {
  return value
    .split(/[-_]/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

function toPascalCase(value) {
  const words = Array.isArray(value) ? value.flatMap(splitWords) : splitWords(value);
  const merged = words
    .map((word) => {
      if (word === "api") return "Api";
      if (word === "ui") return "Ui";
      if (word === "db") return "Db";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");

  return merged || "Starter";
}

function toTitleCase(value) {
  const words = Array.isArray(value) ? value.flatMap(splitWords) : splitWords(value);
  return words
    .map((word) => {
      if (word === "api") return "API";
      if (word === "ui") return "UI";
      if (word === "db") return "DB";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function toConstName(value) {
  const words = Array.isArray(value) ? value.flatMap(splitWords) : splitWords(value);
  return words
    .map((word, index) => {
      const normalized = word.toLowerCase();
      if (index === 0) {
        return normalized;
      }
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join("") || "starterValue";
}

function getModuleSegment(parts) {
  return parts.at(-2) ?? "starter";
}

function getRelativeParts(filePath) {
  return path.relative(architectureRoot, filePath).split(path.sep);
}

function isFrontend(parts) {
  return parts.includes("client") || (parts.includes("apps") && parts.includes("web"));
}

function isBackend(parts) {
  return parts.includes("server") || (parts.includes("apps") && parts.includes("api"));
}

function buildAssetModule(parts, relativePath) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Manifest`;
  const label = toTitleCase(segment);

  return `export const ${constName} = [
  {
    key: "${segment}-hero",
    label: "${label} hero",
    path: "/${segment}/hero-placeholder"
  },
  {
    key: "${segment}-cover",
    label: "${label} cover",
    path: "/${segment}/cover-placeholder"
  }
];

export const ${toConstName(segment)}Source = "${relativePath.replace(/\\/g, "/")}";

export default ${constName};
`;
}

function buildComponentModule(parts) {
  const segment = getModuleSegment(parts);
  const baseName = toPascalCase(segment);
  const componentName =
    segment === "header"
      ? `${baseName}Bar`
      : segment === "banner"
        ? `${baseName}Section`
        : segment === "charts"
          ? `${baseName}Panel`
          : segment === "ui"
            ? `${baseName}Showcase`
            : segment === "title"
              ? `${baseName}Block`
              : baseName;
  const title = toTitleCase(segment);

  return `type ${componentName}Props = {
  title?: string;
  description?: string;
  items?: string[];
};

const defaultItems = [
  "Wire up real API calls",
  "Replace placeholder copy",
  "Connect this module to your route tree"
];

export default function ${componentName}({
  title = "${title}",
  description = "Starter implementation for the ${title.toLowerCase()} module.",
  items = defaultItems
}: ${componentName}Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          ${title}
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <article key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildContextModule(parts) {
  const segment = getModuleSegment(parts);
  const baseName = toPascalCase(segment);
  const contextName = `${baseName}Context`;
  const hookName = `use${baseName}`;

  return `import { createContext, useContext, useState, type PropsWithChildren } from "react";

type ${baseName}State = {
  activeSection: string;
  setActiveSection: (value: string) => void;
};

const ${contextName} = createContext<${baseName}State | undefined>(undefined);

export function ${baseName}Provider({ children }: PropsWithChildren) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <${contextName}.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </${contextName}.Provider>
  );
}

export function ${hookName}() {
  const context = useContext(${contextName});

  if (!context) {
    throw new Error("${hookName} must be used inside ${baseName}Provider.");
  }

  return context;
}
`;
}

function buildHookModule(parts) {
  const segment = getModuleSegment(parts);
  const hookName = `use${toPascalCase(segment)}`;

  return `import { useEffect, useState } from "react";

type LoadState = "idle" | "loading" | "ready";

export default function ${hookName}() {
  const [state, setState] = useState<LoadState>("idle");
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setState("loading");

    const timer = window.setTimeout(() => {
      setItems([
        "${toTitleCase(segment)} starter task",
        "Replace mock data",
        "Connect real permissions"
      ]);
      setState("ready");
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  return {
    state,
    items
  };
}
`;
}

function buildDataModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Data`;
  const title = toTitleCase(segment);

  if (segment === "menu-items") {
    return `export const menuItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "reports", label: "Reports", href: "/reports" },
  { id: "settings", label: "Settings", href: "/settings" }
];

export default menuItems;
`;
  }

  return `export const ${constName} = [
  {
    id: "${segment}-overview",
    title: "${title} overview",
    description: "Starter content block for the ${title.toLowerCase()} area."
  },
  {
    id: "${segment}-workflow",
    title: "${title} workflow",
    description: "Replace this data with your live module configuration."
  }
];

export default ${constName};
`;
}

function buildTypeModule(parts) {
  const segment = getModuleSegment(parts);
  const baseName = toPascalCase(segment);

  return `export type ${baseName}Status = "draft" | "active" | "archived";

export interface ${baseName}Record {
  id: string;
  title: string;
  description: string;
  status: ${baseName}Status;
}

export interface ${baseName}Filter {
  search?: string;
  status?: ${baseName}Status;
}
`;
}

function buildLayoutModule(parts) {
  const segment = getModuleSegment(parts);
  const componentName = `${toPascalCase(segment)}Layout`;
  const title = toTitleCase(segment);

  return `import type { PropsWithChildren } from "react";

type ${componentName}Props = PropsWithChildren<{
  heading?: string;
  summary?: string;
}>;

export default function ${componentName}({
  heading = "${title} Layout",
  summary = "Starter layout wrapper for this workspace section.",
  children
}: ${componentName}Props) {
  return (
    <section className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <header className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Layout</p>
        <h1 className="mt-2 text-3xl font-semibold">{heading}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{summary}</p>
      </header>

      <div className="mx-auto mt-6 max-w-6xl">{children}</div>
    </section>
  );
}
`;
}

function buildRouteModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Routes`;
  const label = toTitleCase(segment);

  return `export type StarterRoute = {
  path: string;
  label: string;
  permission?: string;
};

export const ${constName}: StarterRoute[] = [
  {
    path: "/${segment}",
    label: "${label} Home"
  },
  {
    path: "/${segment}/create",
    label: "${label} Create",
    permission: "${segment}.create"
  },
  {
    path: "/${segment}/view/:id",
    label: "${label} Detail",
    permission: "${segment}.read"
  }
];

export default ${constName};
`;
}

function buildStyleModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Tokens`;

  return `export const ${constName} = {
  background: "#f8fafc",
  panel: "#ffffff",
  accent: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0"
};

export function get${toPascalCase(segment)}Shadow() {
  return "0 24px 64px rgba(15, 23, 42, 0.08)";
}
`;
}

function buildUtilityModule(parts) {
  const segment = getModuleSegment(parts);

  return `export function to${toPascalCase(segment)}Slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function format${toPascalCase(segment)}Label(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\\b\\w/g, (character) => character.toUpperCase());
}
`;
}

function buildViewModule(parts) {
  const segment = getModuleSegment(parts);
  const componentName = `${toPascalCase(segment)}Page`;
  const title = toTitleCase(segment);

  return `const tasks = [
  "Connect the page to real data",
  "Replace starter metrics",
  "Hook up page-specific actions"
];

export default function ${componentName}() {
  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          ${title}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">${title} Page</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use this starter page as the first real implementation for the ${title.toLowerCase()} section.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {tasks.map((task) => (
          <article key={task} className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-700">
            {task}
          </article>
        ))}
      </section>
    </main>
  );
}
`;
}

function buildBackendControllerModule(parts) {
  const segment = getModuleSegment(parts);
  const baseName = toPascalCase(segment);

  return `export type StarterRequest = {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, unknown>;
  user?: {
    id: string;
    role: string;
  };
};

export type StarterResponse = {
  statusCode: number;
  body: Record<string, unknown>;
};

export async function list${baseName}(request: StarterRequest): Promise<StarterResponse> {
  return {
    statusCode: 200,
    body: {
      feature: "${segment}",
      filters: request.query ?? {},
      items: []
    }
  };
}

export async function create${baseName}(request: StarterRequest): Promise<StarterResponse> {
  return {
    statusCode: 201,
    body: {
      feature: "${segment}",
      payload: request.body ?? {}
    }
  };
}
`;
}

function buildBackendConfigModule(parts) {
  const segment = getModuleSegment(parts);

  return `export const ${toConstName(segment)}Config = {
  client: process.env.DB_CLIENT || "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "__APP_NAME__",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || ""
};

export default ${toConstName(segment)}Config;
`;
}

function buildBackendMigrationModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Plan`;

  return `export const ${constName} = [
  {
    id: "001_create_users",
    description: "Create the users table or collection."
  },
  {
    id: "002_create_roles",
    description: "Create the permissions and roles structure."
  }
];

export default ${constName};
`;
}

function buildBackendModelModule(parts) {
  const segment = getModuleSegment(parts);
  const baseName = toPascalCase(segment === "models" ? "module-model" : segment);

  return `export interface ${baseName}Record {
  id: string;
  name: string;
  status: "draft" | "active";
  createdAt: string;
}

export const ${toConstName(segment)}Fields = [
  "id",
  "name",
  "status",
  "createdAt"
];

export default ${toConstName(segment)}Fields;
`;
}

function buildBackendSeederModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Seeds`;

  return `export const ${constName} = [
  {
    id: "starter-admin",
    name: "Starter Admin"
  },
  {
    id: "starter-operator",
    name: "Starter Operator"
  }
];

export default ${constName};
`;
}

function buildBackendRouteModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}ApiRoutes`;

  return `export type ApiRouteDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  protected?: boolean;
};

export const ${constName}: ApiRouteDefinition[] = [
  {
    method: "GET",
    path: "/${segment}",
    handler: "list${toPascalCase(segment)}",
    protected: true
  },
  {
    method: "POST",
    path: "/${segment}",
    handler: "create${toPascalCase(segment)}",
    protected: true
  }
];

export default ${constName};
`;
}

function buildBackendMiddlewareModule(parts) {
  const segment = getModuleSegment(parts);
  const baseName = toPascalCase(segment);

  return `export type AccessContext = {
  role?: string;
  permissions?: string[];
};

export function require${baseName}(context: AccessContext) {
  if (!context.role) {
    return {
      allowed: false,
      reason: "Missing authenticated role."
    };
  }

  return {
    allowed: true,
    reason: "${baseName} access granted."
  };
}

export default require${baseName};
`;
}

function buildBackendScriptModule(parts) {
  const segment = getModuleSegment(parts);
  const constName = `${toConstName(segment)}Tasks`;

  return `export const ${constName} = [
  "migrate",
  "seed",
  "verify"
];

export function run${toPascalCase(segment)}Task(taskName: string) {
  return {
    taskName,
    executedAt: new Date().toISOString()
  };
}
`;
}

function buildBackendServiceModule(parts) {
  const segment = getModuleSegment(parts);
  const serviceName = `${toConstName(segment)}Service`;

  return `export const ${serviceName} = {
  summarize(items: Array<Record<string, unknown>>) {
    return {
      count: items.length,
      updatedAt: new Date().toISOString()
    };
  },
  emptyState() {
    return {
      title: "${toTitleCase(segment)} service",
      description: "Replace this starter service with your real business logic."
    };
  }
};

export default ${serviceName};
`;
}

function buildBackendFallbackModule(parts, relativePath) {
  const segment = getModuleSegment(parts);

  return `export const ${toConstName(segment)}Module = {
  key: "${segment}",
  source: "${relativePath.replace(/\\/g, "/")}"
};

export default ${toConstName(segment)}Module;
`;
}

function buildFrontendModule(parts, relativePath) {
  if (parts.includes("components")) return buildComponentModule(parts);
  if (parts.includes("context") || parts.includes("context-api")) return buildContextModule(parts);
  if (parts.includes("hooks")) return buildHookModule(parts);
  if (parts.includes("data")) return buildDataModule(parts);
  if (parts.includes("types") || parts.includes("interface")) return buildTypeModule(parts);
  if (parts.includes("layout")) return buildLayoutModule(parts);
  if (parts.includes("routes")) return buildRouteModule(parts);
  if (parts.includes("styles")) return buildStyleModule(parts);
  if (parts.includes("utils") || (parts.includes("lib") && parts.includes("utils"))) {
    return buildUtilityModule(parts);
  }
  if (parts.includes("view")) return buildViewModule(parts);
  if (parts.includes("assets") || parts.includes("public")) return buildAssetModule(parts, relativePath);

  return buildBackendFallbackModule(parts, relativePath);
}

function buildBackendModule(parts, relativePath) {
  if (parts.includes("controllers")) return buildBackendControllerModule(parts);
  if (parts.includes("middleware")) return buildBackendMiddlewareModule(parts);
  if (parts.includes("routes")) return buildBackendRouteModule(parts);
  if (parts.includes("services")) return buildBackendServiceModule(parts);
  if (parts.includes("scripts")) return buildBackendScriptModule(parts);
  if (parts.includes("config")) return buildBackendConfigModule(parts);
  if (parts.includes("migrations")) return buildBackendMigrationModule(parts);
  if (parts.includes("models")) return buildBackendModelModule(parts);
  if (parts.includes("seeders")) return buildBackendSeederModule(parts);

  return buildBackendFallbackModule(parts, relativePath);
}

function buildModule(relativePath) {
  const parts = relativePath.split(/[\\/]/g);

  if (isFrontend(parts)) {
    return buildFrontendModule(parts, relativePath);
  }

  if (isBackend(parts)) {
    return buildBackendModule(parts, relativePath);
  }

  return buildBackendFallbackModule(parts, relativePath);
}

function main() {
  const files = walkIndexFiles(architectureRoot);

  for (const filePath of files) {
    const relativePath = path.relative(architectureRoot, filePath);
    fs.writeFileSync(filePath, buildModule(relativePath), "utf8");
  }

  console.log(`Generated ${files.length} architecture stub modules.`);
}

main();
