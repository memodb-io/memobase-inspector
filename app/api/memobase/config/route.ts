import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient } from "@/utils/memobase/client";

/**
 * 获取项目配置
 * @returns 项目配置
 */
export async function GET() {
  try {
    const config = await (await memoBaseClient()).getConfig()

    return createApiResponse(config);
  } catch (error) {
    console.error(error);
    return createApiError("Internal Server Error", 500);
  }
}

/**
 * 更新项目配置
 */
export async function PUT(req: Request) {
  const { config } = await req.json();
  if (!config) {
    return createApiError("参数错误", 400);
  }

  try {
    await (await memoBaseClient()).updateConfig(config)
  } catch (e) {
    console.error(e);
    return createApiError("Internal Server Error", 500);
  }

  return createApiResponse();
}
