import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { getSession } from "./session.server";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_PROJ_URL!,
  process.env.SUPABASE_PUBLIC_KEY!
);

export const hasAuthSession = async (request: Request) => {
  let session = await getSession(request.headers.get("Cookie"));
  if (!session.has("access_token")) throw Error("No session");
  supabase.auth.setAuth(session.get("access_token"));
};
