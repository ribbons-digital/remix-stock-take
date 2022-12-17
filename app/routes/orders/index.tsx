import type { LoaderFunction } from "@remix-run/node";
import { Button, Table, HoverCard } from "@mantine/core";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { getOrders } from "~/api/order";

import type { OrderItemType, OrderType } from "~/types";

export const loader: LoaderFunction = async () => {
  const orders = await getOrders();

  return orders;
};

export default function OrdersIndex() {
  const orders = useLoaderData<OrderType[]>();
  const navigate = useNavigate();

  const goToNewOrder = () => {
    navigate("/orders/new");
  };
  return (
    <div className="flex flex-col mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Button variant="outline" type="button" onClick={goToNewOrder}>
          + Add New Order
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Order number</th>
            <th>Order date</th>
            <th>Quantity</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            return (
              <tr key={order._id}>
                <td>
                  <Link to={`/orders/${order._id}`}>
                    <div className="underline underline-offset-1 text-blue-700">
                      {order.orderNumber}
                    </div>
                  </Link>
                </td>
                <td>{order.date}</td>
                <td>
                  {order.orderedItems.reduce(
                    (prevValue, currItem) =>
                      prevValue + Number(currItem.quantity),
                    0
                  )}
                </td>
                <td>
                  <HoverCard shadow="md" width={280}>
                    <HoverCard.Target>
                      <Button
                        variant="subtle"
                        size="sm"
                        rightIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3 h-3 ml-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        {order.orderedItems.length}
                      </Button>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <ul>
                        {order.orderedItems.map((item, i) => {
                          return (
                            <li key={`${item._id}-${i}`}>
                              {item.orderedItem.name} x {item.quantity}
                            </li>
                          );
                        })}
                      </ul>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </td>
                <td>
                  $
                  {order.orderedItems.reduce(
                    (prevValue, currItem) =>
                      prevValue + currItem.orderedItem.price,
                    0
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
