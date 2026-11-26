import fs from "node:fs";
import path from "node:path";
import { projectsData } from "../config/work";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const LOCALES = ["en", "de", "ar"] as const;
const DICT_DIR = path.join(process.cwd(), "lib", "dictionaries");

function loadJson(locale: string): JsonValue {
  const filePath = path.join(DICT_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing dictionary file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as JsonValue;
}

function isPlainObject(v: JsonValue): v is { [key: string]: JsonValue } {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const errors: string[] = [];

function compareTrees(
  base: JsonValue,
  target: JsonValue,
  targetLocale: string,
  keyPath: string
) {
  if (Array.isArray(base)) {
    if (!Array.isArray(target)) {
      errors.push(`[${targetLocale}] ${keyPath}: expected array`);
      return;
    }
    if (base.length !== target.length) {
      errors.push(
        `[${targetLocale}] ${keyPath}: array length mismatch (en=${base.length}, ${targetLocale}=${target.length})`
      );
    }
    const len = Math.min(base.length, target.length);
    for (let i = 0; i < len; i += 1) {
      compareTrees(base[i], target[i], targetLocale, `${keyPath}[${i}]`);
    }
    return;
  }

  if (isPlainObject(base)) {
    if (!isPlainObject(target)) {
      errors.push(`[${targetLocale}] ${keyPath}: expected object`);
      return;
    }

    const baseKeys = Object.keys(base);
    const targetKeys = Object.keys(target);

    for (const k of baseKeys) {
      const nextPath = keyPath ? `${keyPath}.${k}` : k;
      if (!(k in target)) {
        errors.push(`[${targetLocale}] Missing key: ${nextPath}`);
      } else {
        compareTrees(base[k], target[k], targetLocale, nextPath);
      }
    }

    for (const k of targetKeys) {
      if (!(k in base)) {
        const nextPath = keyPath ? `${keyPath}.${k}` : k;
        errors.push(`[${targetLocale}] Extra key not in en.json: ${nextPath}`);
      }
    }
    return;
  }

  if (typeof base !== typeof target) {
    errors.push(
      `[${targetLocale}] ${keyPath}: type mismatch (en=${typeof base}, ${targetLocale}=${typeof target})`
    );
    return;
  }

  if (typeof target === "string" && target.trim().length === 0) {
    errors.push(`[${targetLocale}] ${keyPath}: empty string value`);
  }
}

function validateBaseNonEmpty(node: JsonValue, keyPath: string) {
  if (typeof node === "string" && node.trim().length === 0) {
    errors.push(`[en] ${keyPath}: empty string value`);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => validateBaseNonEmpty(item, `${keyPath}[${i}]`));
    return;
  }
  if (isPlainObject(node)) {
    for (const [k, v] of Object.entries(node)) {
      validateBaseNonEmpty(v, keyPath ? `${keyPath}.${k}` : k);
    }
  }
}

function validateProjects() {
  for (const project of projectsData) {
    const textFields = [
      "title",
      "category",
      "metaDescription",
      "problem",
      "solution",
      "result",
    ] as const;
    for (const field of textFields) {
      for (const loc of LOCALES) {
        const val = project[field]?.[loc];
        if (typeof val !== "string" || val.trim().length === 0) {
          errors.push(
            `[config/work.ts] Project "${project.slug}" missing/empty ${field}.${loc}`
          );
        }
      }
    }

    const listFields = ["tags", "features"] as const;
    for (const field of listFields) {
      for (const loc of LOCALES) {
        const arr = project[field]?.[loc];
        if (!Array.isArray(arr) || arr.length === 0) {
          errors.push(
            `[config/work.ts] Project "${project.slug}" missing/empty ${field}.${loc}`
          );
        }
      }
    }

    if (project.demoNote) {
      for (const loc of LOCALES) {
        const val = project.demoNote[loc];
        if (typeof val !== "string" || val.trim().length === 0) {
          errors.push(
            `[config/work.ts] Project "${project.slug}" missing/empty demoNote.${loc}`
          );
        }
      }
    }

    if (project.secondaryImages) {
      project.secondaryImages.forEach((img, idx) => {
        for (const loc of LOCALES) {
          const val = img.alt?.[loc];
          if (typeof val !== "string" || val.trim().length === 0) {
            errors.push(
              `[config/work.ts] Project "${project.slug}" secondaryImages[${idx}].alt.${loc} missing/empty`
            );
          }
        }
      });
    }
  }
}

function main() {
  const en = loadJson("en");
  const de = loadJson("de");
  const ar = loadJson("ar");

  validateBaseNonEmpty(en, "");
  compareTrees(en, de, "de", "");
  compareTrees(en, ar, "ar", "");
  validateProjects();

  if (errors.length > 0) {
    console.error(
      `❌ Translation parity check failed with ${errors.length} error(s):`
    );
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `✅ Translation parity check passed across en / de / ar dictionaries and ${projectsData.length} projects in config/work.ts.`
  );
}

main();
