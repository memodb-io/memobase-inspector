import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient, getMemobaseUser } from "@/utils/memobase/client";

export async function POST() {
  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());
    await user.flush();
  } catch {
    return createApiError("失败", 500);
  }

  return createApiResponse(null, "成功");
}
