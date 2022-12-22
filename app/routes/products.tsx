import { Tabs } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { isLoggedIn } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  return await isLoggedIn({ request });
};

export default function Products() {
  const location = useLocation();
  return (
    <AppLayout>
      <Tabs
        defaultValue={
          location.pathname === "/products" ? "products" : "shopify-products"
        }
      >
        <Tabs.List>
          <Link className="no-underline" to="/products">
            <Tabs.Tab value="products">Orders</Tabs.Tab>
          </Link>
          <Link className="no-underline" to="/products/shopify">
            <Tabs.Tab value="shopify-products">Shopify Orders</Tabs.Tab>
          </Link>
        </Tabs.List>
        <Outlet />
      </Tabs>
    </AppLayout>
  );
}
