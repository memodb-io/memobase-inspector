"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { updateConfig } from "@/api/models/memobase";

import { toast } from "sonner";

import { Project } from "@/types";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ReactCodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { okaidia } from "@uiw/codemirror-theme-okaidia";

import { useTheme } from "next-themes";

export default function Config({
  project,
  onRefresh,
}: {
  project: Project;
  onRefresh: () => void;
}) {
  const { theme } = useTheme();
  const t = useTranslations("project.config");
  const [loading, setLoading] = useState(false);
  const [defaultConfigYaml, setDefaultConfigYaml] = useState(
    project?.config_yaml || "# Memobase Project Config"
  );

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateConfig(defaultConfigYaml);
      if (res.code === 0) {
        onRefresh();
        toast.success(t("updateSuccess"));
      } else {
        toast.error(res.message || t("updateFailed"));
      }
    } catch {
      toast.error(t("updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label>
              {t("advanced.config")}
              <Link
                href="https://docs.memobase.io/references/full"
                target="_blank"
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  {t("advanced.docs")}
                  <ArrowUpRight />
                </Badge>
              </Link>
              <Link
                href="https://app.memobase.io/playground/config-tool"
                target="_blank"
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  {t("advanced.tool")}
                  <ArrowUpRight />
                </Badge>
              </Link>
            </Label>
          </div>
          <ReactCodeMirror
            value={defaultConfigYaml}
            theme={theme === "dark" ? okaidia : "light"}
            extensions={[yaml()]}
            minHeight="200px"
            maxHeight="500px"
            onChange={(v) => setDefaultConfigYaml(v)}
            className="rounded-md border border-input overflow-hidden"
          />
        </div>

        <div className="flex justify-end">
          <Button size="sm" disabled={loading} onClick={handleUpdate}>
            {t("save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
