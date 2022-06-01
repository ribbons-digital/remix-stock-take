import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import ResponsiveAppBar from "~/components/AppBar";
import { destroySession, getSession } from "~/services/session.server";
import { supabase } from "~/services/supabase";
import type { AuthType } from "~/types";
import { isLoggedIn, signOut } from "~/utils";

export let loader: LoaderFunction = async ({ request }) => {
  return await isLoggedIn({ request });
};

export default function Index() {
  const { user } = useLoaderData<AuthType>();
  return (
    <div>
      <ResponsiveAppBar user={user} />
      <h1>Home</h1>
    </div>
  );
}
