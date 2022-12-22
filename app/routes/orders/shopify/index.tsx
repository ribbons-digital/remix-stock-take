import { LoaderFunction } from "@remix-run/node";
import { getShopifyOrders } from "~/api/order";

export const loader: LoaderFunction = async () => {
  const { orders } = await getShopifyOrders();
  console.log({ orders });
  return orders;
};

export default function ShopifyIndexRouter() {
  return <div>Shopify Orders</div>;
}
