import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient, getMemobaseUser } from "@/utils/memobase/client";

export async function GET() {
  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());
    const event = await user.event();

    return createApiResponse(event, "获取记录成功");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "获取记录失败";
    return createApiError(errorMessage, 500);
  }
}
