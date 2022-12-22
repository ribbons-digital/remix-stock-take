import { Tabs } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function ShopifyProductsParentLayoutRoute() {
  return (
    <Tabs.Panel value="shopify-products">
      <Outlet />
    </Tabs.Panel>
  );
}
