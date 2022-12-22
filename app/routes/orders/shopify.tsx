import { Tabs } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function ShopifyParentLayoutRoute() {
  return (
    <Tabs.Panel value="shopify-orders">
      <Outlet />
    </Tabs.Panel>
  );
}
