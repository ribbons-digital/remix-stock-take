import { redirect } from "@remix-run/node";
import type { ApiError, User } from "@supabase/supabase-js";
import { destroySession, getSession } from "~/services/session.server";
import { supabase } from "~/services/supabase";
import type { AuthType } from "~/types";

export function validatefieldContent(content: string) {
  if (!content) {
    return `The field can't be empty`;
  }
}

export const modalStyle = ({ width }: { width: number | string }) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "70%",
  overflow: "scroll",
});

export function groupBy<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K | { (obj: T): string }
): Record<string, T[]> {
  const keyFn = key instanceof Function ? key : (obj: T) => obj[key];
  return array.reduce((objectsByKeyValue, obj) => {
    const value = keyFn(obj);
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {} as Record<string, T[]>);
}

export async function isLoggedIn({
  request,
}: {
  request: Request;
}): Promise<AuthType> {
  const redirectTo = new URL(request.url).pathname;

  console.log(request.headers.get("Cookie"));

  let session = await getSession(request.headers.get("Cookie"));
  console.log(session.has("access_token"));

  // if there is no access token in the header then
  // the user is not authenticated, go to login
  if (!session.has("access_token")) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  } else {
    // otherwise execute the query for the page, but first get token
    const { user, error: sessionErr } = await supabase.auth.api.getUser(
      session.get("access_token")
    );

    if (!user) {
      let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/login?${searchParams}`, {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    // if no error then get then set authenticated session
    // to match the user associated with the access_token
    if (!sessionErr) {
      // activate the session with the auth_token
      supabase.auth.setAuth(session.get("access_token"));

      // return data and any potential errors along with user
      return { user };
    } else {
      return { error: sessionErr };
    }
  }
}

export async function signOut({ request }: { request: Request }) {
  // get session
  let session = await getSession(request.headers.get("Cookie"));

  // destroy session and redirect to login page
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
