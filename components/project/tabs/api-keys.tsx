"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";

import { Eye, EyeOff, ArrowUpRight } from "lucide-react";

import { Project } from "@/types";

export default function ApiKeys({ project }: { project: Project }) {
  const t = useTranslations("project.apiKeys");
  const [showToken, setShowToken] = useState(false);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">URL</p>
            <CopyButton textToCopy={project?.endpoint_url || ""} />
          </div>
          <p className="text-sm bg-muted/50 p-2 rounded-md">
            {project?.endpoint_url}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="flex justify-center items-center text-sm font-medium">
              {"KEY"}
              <Link
                className="flex justify-center items-center text-sm text-muted-foreground hover:text-primary underline ml-2 group/item"
                href="https://docs.memobase.io/quickstart#connect-to-memobase-backend"
                target="_blank"
              >
                {t("keyTips")}
                <ArrowUpRight className="h-4 w-4 opacity-50 group-hover/item:opacity-100" />
              </Link>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowToken(!showToken)}
                className="h-8 w-8"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <CopyButton textToCopy={project?.endpoint_token || ""} />
            </div>
          </div>
          <p className="text-sm bg-muted/50 p-2 rounded-md font-mono">
            {showToken ? project?.endpoint_token : "••••••••••••••••"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
