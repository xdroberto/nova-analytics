"use server";

import { cookies } from "next/headers";

import {
  getPreferencePersistence,
  PREFERENCE_REGISTRY,
  type PreferenceKey,
  type PreferenceValueMap,
  parsePreference,
} from "@/lib/preferences/preferences-config";

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  // Allow-list: this action exists ONLY to persist known UI preferences. Without
  // this guard it was a generic same-origin cookie-write primitive callable with
  // any name. (`getValueFromCookie` — a matching arbitrary cookie-READ action that
  // could return the HttpOnly session token — was dead code and has been removed.)
  if (!(key in PREFERENCE_REGISTRY)) {
    throw new Error(`setValueToCookie: refusing to write unknown cookie key "${key}"`);
  }
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

export async function getPreference<K extends PreferenceKey>(key: K): Promise<PreferenceValueMap[K]> {
  const definition = PREFERENCE_REGISTRY[key];
  const persistence = getPreferencePersistence(key);

  if (persistence !== "client-cookie" && persistence !== "server-cookie") {
    return definition.defaultValue as PreferenceValueMap[K];
  }

  const cookieStore = await cookies();
  return parsePreference(key, cookieStore.get(key)?.value.trim());
}
