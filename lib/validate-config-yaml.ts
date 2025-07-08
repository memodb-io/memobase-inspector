import { parse } from "yaml";
import { useTranslations } from "next-intl";

interface ValidationResult {
  valid: boolean;
  error?: string;
  parsed?: Record<string, unknown>;
}

function hasInvalidKeys(obj: unknown): string | null {
  if (typeof obj !== "object" || obj === null) return null;

  for (const key of Object.keys(obj as Record<string, unknown>)) {
    if (key.startsWith("llm_") || key.startsWith("embedding_")) {
      return key;
    }

    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === "object" && value !== null) {
      const nested = hasInvalidKeys(value);
      if (nested) return nested;
    }
  }

  return null;
}

export function useValidateConfigYaml() {
  const t = useTranslations("yaml");

  const validate = (yamlString: string): ValidationResult => {
    try {
      const parsed = parse(yamlString);

      if (typeof parsed !== "object" && parsed !== null) {
        return { valid: false, error: t("invalidRoot") };
      }

      const invalidKey = hasInvalidKeys(parsed);
      if (invalidKey) {
        return {
          valid: false,
          error: t("invalidKey", { key: invalidKey }),
        };
      }

      return { valid: true, parsed };
    } catch (e) {
      const error =
        e instanceof Error ? e.message : t("unknownError") || "unknown error";
      return { valid: false, error };
    }
  };

  return { validate };
}
