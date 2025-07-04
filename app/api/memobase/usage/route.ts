import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient } from "@/utils/memobase/client";

/**
 * 获取项目用量
 * @returns 用量
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const last_days = parseInt(searchParams.get("last_days") || "7");

    const [usages] = await Promise.all([(await memoBaseClient()).getUsage(last_days)])

    const sortedUsage = [...usages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return createApiResponse({ usages: sortedUsage });
  } catch (error) {
    console.error(error);
    return createApiError("Internal Server Error", 500);
  }
}
