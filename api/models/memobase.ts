import service, { Res } from "../http";
import { UserProfile, UserEvent, GetProjectUsersResponse, GetProjectUsageItemResponse } from "@memobase/memobase";

export const getProfile = (): Promise<Res<UserProfile[]>> =>
  service.get("/api/memobase/profile");

export const insertMessages = (
  messages: {
    role: "user" | "assistant";
    content: string;
    alias?: string | undefined;
    created_at?: string | undefined;
  }[]
): Promise<Res<null>> =>
  service.post("/api/memobase/insert", {
    messages,
  });

export const flash = (): Promise<Res<null>> =>
  service.post("/api/memobase/flash");

export const getEvent = (): Promise<Res<UserEvent[]>> =>
  service.get("/api/memobase/event");

export const addProfile = (content: string, topic: string, subTopic: string): Promise<Res<null>> =>
  service.post("/api/memobase/profile", {
    content,
    topic,
    sub_topic: subTopic,
  });

export const deleteProfile = (id: string): Promise<Res<null>> =>
  service.delete(`/api/memobase/profile/${id}`);

export const updateProfile = (id: string, content: string, topic: string, subTopic: string): Promise<Res<null>> =>
  service.put(`/api/memobase/profile/${id}`, {
    content,
    topic,
    sub_topic: subTopic,
  });

export const deleteUser = (): Promise<Res<null>> =>
  service.delete(`/api/memobase/user`);

export const deleteUserByUid = (uid: string): Promise<Res<null>> =>
  service.delete(`/api/memobase/user/${uid}`);

export const getProjectUsers = (pid: string, search: string, order_by: string, order_desc: boolean, limit: number, offset: number) => {
  return service.get<Res<GetProjectUsersResponse>>(`/api/memobase/user`, { search, order_by, order_desc, limit, offset });
}

export const getProjectUsage = (last_days: number = 7) => {
  return service.get<Res<{ usages: GetProjectUsageItemResponse[] }>>(`/api/memobase/usage?last_days=${last_days}`);
};

export const deleteEvent = (id: string): Promise<Res<null>> =>
  service.delete(`/api/memobase/event/${id}`);

export const getConfig = (): Promise<Res<string>> =>
  service.get("/api/memobase/config");

export const updateConfig = (config: string): Promise<Res<null>> =>
  service.put("/api/memobase/config", {
    config,
  });

export const getProjectUserMemories = (uid: string) => {
  return service.get<Res<{ profiles: UserProfile[], events: UserEvent[] }>>(`/api/memobase/user/${uid}/memories`);
}
