import { createApiResponse, createApiError } from "@/lib/api-response";

import { memoBaseClient, getMemobaseUser } from "@/utils/memobase/client";

/**
 * 删除 profile
 * @param profile_id profile ID
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ profile_id: string }> }) {
  const { profile_id } = await params;
  if (!profile_id) {
    return createApiError("Bad Request", 400);
  }

  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());
    await user.deleteProfile(profile_id);
  } catch (error: unknown) {
    console.error(error);
    return createApiError("删除失败", 500);
  }

  return createApiResponse(null, "删除成功");
}


/**
 * 更新 profile
 * @param profile_id profile ID
 * @param body profile data
 */
export async function PUT(req: Request, { params }: { params: Promise<{ profile_id: string }> }) {
  const { profile_id } = await params;
  if (!profile_id) {
    return createApiError("Bad Request", 400);
  }

  const { content, topic, sub_topic } = await req.json();
  if (!content || !topic || !sub_topic) {
    return createApiError("Bad Request", 400);
  }

  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());
    await user.updateProfile(profile_id, content, topic, sub_topic)
  } catch (error: unknown) {
    console.error(error);
    return createApiError("失败", 500);
  }

  return createApiResponse(null, "成功");
}
