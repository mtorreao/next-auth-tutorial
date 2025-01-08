"use server";

import { signOut as signOutAuth } from "@/auth";
import { HOME_ROUTE } from "@/routes";

export async function signOut() {
  await signOutAuth({
    redirectTo: HOME_ROUTE,
  });
}
