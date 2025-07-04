import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient } from "@/utils/memobase/client";

/**
 * 获取项目用户画像和事件信息
 * @returns 用户
 */
export async function GET(req: Request, { params }: { params: Promise<{ pid: string, uid: string }> }) {
  const { uid } = await params;
  if (!uid) {
    return createApiError("Project not found", 404);
  }
  try {
    const user = await await (await memoBaseClient()).getUser(uid);

    const [profiles, events] = await Promise.all([user.profile(), user.event()])

    return createApiResponse({
      profiles: profiles,
      events: events,
    });
  } catch (error) {
    console.error(error);
    return createApiError("Internal Server Error", 500);
  }
}
