import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient, getMemobaseUser } from "@/utils/memobase/client";

/**
 * 获取 profile
 */
export async function GET() {
  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());
    const profiles = await user.profile();

    return createApiResponse(profiles, "获取记录成功");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "获取记录失败";
    return createApiError(errorMessage, 500);
  }
}

/**
 * 添加 profile
 * @param body profile data
 */
export async function POST(req: Request) {
  const { content, topic, sub_topic } = await req.json();
  if (!content || !topic || !sub_topic) {
    return createApiError("Bad Request", 400);
  }

  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());
    await user.addProfile(content, topic, sub_topic)
  } catch (error: unknown) {
    console.error(error);
    return createApiError("失败", 500);
  }

  return createApiResponse(null, "成功");
}
