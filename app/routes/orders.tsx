import { Tabs } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import type { AuthType } from "~/types";
import { isLoggedIn } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  return await isLoggedIn({ request });
};

export default function Orders() {
  return (
    <AppLayout>
      <Tabs defaultValue="orders">
        <Tabs.List>
          <Link className="no-underline" to="/orders">
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
          </Link>
          <Link className="no-underline" to="/orders/shopify">
            <Tabs.Tab value="shopify-orders">Shopify Orders</Tabs.Tab>
          </Link>
        </Tabs.List>
        <Outlet />
      </Tabs>
    </AppLayout>
  );
}
