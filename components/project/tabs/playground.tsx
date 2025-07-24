"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

import { Card, CardContent } from "@/components/ui/card";
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";
import { Thread } from "@/components/assistant-ui/thread";
import { UserMemory } from "@/components/user-memory";

import { UserProfile, UserEvent } from "@memobase/memobase";

import {
  flash,
  getProfile,
  getEvent,
  insertMessages,
  deleteUser,
} from "@/api/models/memobase";

import { toast } from "sonner";

import { Project } from "@/types";

export default function Playground({ project }: { project: Project }) {
  const t = useTranslations("project.playground");
  const [isLoading, setIsLoading] = useState(false);
  const lastUserMessageRef = useRef<string>("");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);

  const runtime = useChatRuntime({
    api: `${process.env["NEXT_PUBLIC_BASE_PATH"] || ""}/api/chat`,
    onResponse: (response) => {
      if (response.status !== 200) {
        return;
      }

      const message = response.headers.get("x-last-user-message") || "";
      lastUserMessageRef.current = decodeURIComponent(message);
    },
    onFinish: async (message) => {
      if (!message.content || message.content.length === 0) {
        return;
      }

      const lastContent = message.content[message.content.length - 1];
      if (lastContent.type === "text") {
        try {
          const res = await insertMessages([
            {
              role: "user",
              content: lastUserMessageRef.current,
            },
            {
              role: "assistant",
              content: lastContent.text,
            },
          ]);
          if (res.code !== 0) {
            toast.error(res.message || t("insertRecordsFailed"));
            return;
          }

          const flashRes = await flash();
          if (flashRes.code === 0) {
            await fetchProfile();
            await fetchEvent();
          } else {
            toast.error(flashRes.message || t("flashRecordsFailed"));
          }
        } catch {
          toast.error(t("insertRecordsFailed"));
        }
      }
    },
  });

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProfile();
      if (res.code === 401) {
        return;
      }
      if (res.code === 0) {
        setProfiles(res.data || []);
      } else {
        toast.error(res.message || t("getRecordsFailed"));
      }
    } catch {
      toast.error(t("getRecordsFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getEvent();
      if (res.code === 401) {
        return;
      }
      if (res.code === 0) {
        setEvents(res.data || []);
      } else {
        toast.error(res.message || t("getRecordsFailed"));
      }
    } catch {
      toast.error(t("getRecordsFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!project) return;
    const init = async () => {
      await fetchProfile();
      await fetchEvent();
    };
    init();
  }, [fetchProfile, fetchEvent, project]);

  return (
    <Card className="py-0 overflow-hidden">
      <CardContent className="px-0 space-y-4">
        <AssistantRuntimeProvider runtime={runtime}>
          <AssistantSidebar threadSlot={<Thread />}>
            <UserMemory
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              events={events}
              profiles={profiles}
              onRefresh={async () => {
                await fetchProfile();
                await fetchEvent();
              }}
              onNewUser={async () => {
                await deleteUser();
                await fetchProfile();
                await fetchEvent();
              }}
              canAdd
              canEdit
              canDelete
            />
          </AssistantSidebar>
        </AssistantRuntimeProvider>
      </CardContent>
    </Card>
  );
}
