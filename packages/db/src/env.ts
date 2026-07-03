import { existsSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";

let hasLoadedEnv = false;

function findUp(fileName: string, startDirectory: string): string | null {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    const candidate = path.join(currentDirectory, fileName);

    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return null;
    }

    currentDirectory = parentDirectory;
  }
}

export function loadWorkspaceEnv(): void {
  if (hasLoadedEnv) {
    return;
  }

  const envPath = findUp(".env", process.cwd());

  if (envPath) {
    config({ path: envPath });
  }

  hasLoadedEnv = true;
}

export function requireDatabaseUrl(): string {
  loadWorkspaceEnv();

  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Make sure the root .env file exists.");
  }

  return databaseUrl;
}
