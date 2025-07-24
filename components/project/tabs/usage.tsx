"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { GetProjectUsageItemResponse } from "@memobase/memobase";
import { getProjectUsage } from "@/api/models/memobase";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "@/types";

const chartConfig = {
  tokens: {
    label: "Token Usage 7d",
    config: {
      left: {
        label: "Input",
        color: "hsl(var(--chart-1))",
      },
      right: {
        label: "Output",
        color: "hsl(var(--chart-2))",
      },
    },
  },
  insert: {
    label: "Insert Requests 7d",
    config: {
      left: {
        label: "Request",
        color: "hsl(var(--chart-1))",
      },
      right: {
        label: "Success",
        color: "hsl(var(--chart-2))",
      },
    },
  },
};

export default function Usage({ project }: { project: Project }) {
  const router = useRouter();
  const t = useTranslations("project");
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<GetProjectUsageItemResponse[] | null>();

  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("tokens");

  const total = useMemo(
    () => ({
      tokens:
        usage?.reduce(
          (acc, curr) => acc + curr.total_input_token + curr.total_output_token,
          0
        ) ?? 0,
      insert:
        usage?.reduce((acc, curr) => acc + curr.total_success_insert, 0) ?? 0,
    }),
    [usage]
  );

  const fetchUsage = useCallback(async () => {
    try {
      const res = await getProjectUsage();
      if (res.code === 401) {
        router.push("/login");
      }
      if (res.code === 0) {
        setUsage(res.data?.usages);
      } else {
        toast.error(res.message || t("getProjectsFailed"));
      }
    } catch {
      toast.error(t("getProjectsFailed"));
    }
  }, [router, t]);

  useEffect(() => {
    if (!project) return;
    setLoading(true);
    fetchUsage().finally(() => {
      setLoading(false);
    });
  }, [fetchUsage, project]);

  return (
    <>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-[60dvh] w-full" />
        </div>
      ) : (
        <Card className="!py-0">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
            <div className="flex">
              {["tokens", "insert"].map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="min-w-44 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[key as keyof typeof total].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="">
            <ChartContainer
              config={chartConfig[activeChart].config}
              className="mx-auto max-h-[calc(100dvh-31rem)]"
            >
              <BarChart
                accessibilityLayer
                data={
                  activeChart === "tokens"
                    ? usage?.map((item) => ({
                        x: item.date,
                        left: item.total_input_token,
                        right: item.total_output_token,
                      }))
                    : usage?.map((item) => ({
                        x: item.date,
                        left: item.total_insert,
                        right: item.total_success_insert,
                      }))
                }
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="x"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="left" fill="var(--color-left)" radius={4} />
                <Bar dataKey="right" fill="var(--color-right)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
