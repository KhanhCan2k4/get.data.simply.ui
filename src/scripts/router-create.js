#!/usr/bin/env node
import fs from "fs";
import path from "path";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);

let { name, path: basePath } = args;

if (!name) {
  console.error(
    "Usage: npm run router:create --name=<module name> --path=<path>"
  );
  process.exit(1);
}

if (!basePath) {
  console.warn("Create new module in default path");
  basePath = "src/routers";
}

const moduleFolder = path.join(basePath, name);

const indexFile = path.join(moduleFolder, "index.tsx");
const viewsFolder = path.join(moduleFolder, "views");
const extraItems = [`constants`, `hooks`, `types`].map((item) =>
  path.join(moduleFolder, `${name}.${item}.ts`)
);

if (!fs.existsSync(moduleFolder)) {
  fs.mkdirSync(moduleFolder, { recursive: true });
}

// INDEX
if (!fs.existsSync(indexFile)) {
  fs.writeFileSync(
    indexFile,
    `export default function ${capitalize(name)}Page() {
        return <div className="p-4 text-2xl font-bold">${capitalize(
          name
        )} Page</div>;
        }
    `
  );
}

// VIEWS FOLDERS
fs.mkdirSync(viewsFolder, { recursive: true });

// EXTRA ITEMS
extraItems.forEach((item) => {
  if (!fs.existsSync(item)) {
    fs.writeFileSync(
      item,
      `export const ${name.toUpperCase()}_TITLE = "${capitalize(name)} Page";\n`
    );
  }
});

console.warn(`Created route module: ${moduleFolder}`);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
