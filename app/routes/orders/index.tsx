import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getOrders } from "~/api/order";

import type { OrderType } from "~/types";

export const loader: LoaderFunction = async () => {
  const orders = await getOrders();

  return orders;
};

export default function OrdersIndex() {
  const orders = useLoaderData<OrderType[]>();
  console.log(orders);

  return (
    <div>
      Orders
      {orders.map((order) => {
        return (
          <div key={order._id}>
            {order.orderedItems.map((item, i) => {
              return <div key={i}>{item.orderedItem.name}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
