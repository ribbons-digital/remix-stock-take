import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ResponsiveAppBar from "~/components/AppBar";
import AppLayout from "~/components/AppLayout";
import type { AuthType } from "~/types";
import { isLoggedIn } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  return await isLoggedIn({ request });
};

export default function Products() {
  const { user } = useLoaderData<AuthType>();

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
