import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";
import { authClient } from "./auth-client";

// pull session from server / database itself

export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

// pull sesssion from client / cookies

export const getClientSession = () => {
  return authClient.useSession();
};
