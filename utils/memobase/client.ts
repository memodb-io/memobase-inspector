"use server";

import { MemoBaseClient } from "@memobase/memobase";

import { cookies } from "next/headers";

const COOKIE_NAME = "MEMOBASE_INSPECTOR_LOCALE";
const USER_COOKIE_NAME = "MEMOBASE_INSPECTOR_USER";

export const memoBaseClient = async () => {
  const locale = await getLocale()
  return new MemoBaseClient(
    locale[0],
    locale[1]
  );
}

export async function getLocale() {
  const locale = (await cookies()).get(COOKIE_NAME)?.value || "";
  return locale.split("|");
}

export async function setLocale(url: string, key: string) {
  const val = `${url}|${key}`;
  const locale = (await cookies()).get(COOKIE_NAME)?.value || "";
  if (locale === val) return;
  (await cookies()).set(COOKIE_NAME, val);
}

export async function clearLocale() {
  (await cookies()).delete(COOKIE_NAME);
  (await cookies()).delete(USER_COOKIE_NAME);
}

export async function getMemobaseUser() {
  const client = await memoBaseClient();
  const uid = await (await cookies()).get(USER_COOKIE_NAME)?.value || "";

  if (!uid) {
    const newUid = await client.addUser();
    (await cookies()).set(USER_COOKIE_NAME, newUid);
    return newUid;
  }

  return uid;
}

