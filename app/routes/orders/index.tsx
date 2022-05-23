import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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
    <div className="flex flex-col">
      Orders
      {orders.map((order) => {
        return (
          <Link key={order._id} prefetch="intent" to={order._id!}>
            {order._id}
          </Link>
        );
      })}
    </div>
  );
}
