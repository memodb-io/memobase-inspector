"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { setLocale } from "@/utils/memobase/client";

export default function ProjectSettingsForm() {
  const router = useRouter();
  const t = useTranslations("settings");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      toast.error(t("emptyContent"));
      return;
    }

    setLoading(true);
    try {
      await setLocale(url, key);
      router.push("/");
    } catch {
      toast.error(t("errorMsg"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{t("title")}</h2>
      <p className="mb-6 text-gray-600">{t("desc")}</p>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="key">KEY</Label>
          <Input
            id="key"
            name="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button type="submit" disabled={loading || !url || !key}>
          {loading ? t("saveing") : t("save")}
        </Button>
      </div>
    </form>
  );
}
