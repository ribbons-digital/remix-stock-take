import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ResponsiveAppBar from "~/components/AppBar";
import type { AuthType } from "~/types";
import { isLoggedIn, signOut } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  return await isLoggedIn({ request });
};

export default function Products() {
  const { user } = useLoaderData<AuthType>();
  console.log({ user });
  return (
    <>
      <ResponsiveAppBar user={user} />
      <Outlet />
    </>
  );
}
