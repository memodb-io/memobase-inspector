"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { clearLocale } from "@/utils/memobase/client";

export function ProjectSwitch() {
  const router = useRouter();
  const t = useTranslations("navigation");

  return (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={async () => {
        await clearLocale();
        router.push("/settings");
      }}
    >
      {t("switch_project")}
    </Button>
  );
}
