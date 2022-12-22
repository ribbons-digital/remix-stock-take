import { Button, HoverCard, Table } from "@mantine/core";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getShopifyOrders } from "~/api/order";
import { OrdersQuery } from "~/graphql/generated/graphql";
import { format } from "date-fns";

export const loader: LoaderFunction = async () => {
  return await getShopifyOrders();
};

export default function ShopifyIndexRouter() {
  const { orders } = useLoaderData<OrdersQuery>();
  return (
    <div className="flex flex-col mx-auto max-w-4xl p-4">
      <Table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order date</th>
            <th>Quantity</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.edges.map((order) => {
            return (
              <tr key={order.node.id}>
                <td>
                  <div className="underline underline-offset-1 text-blue-700">
                    {order.node.id}
                  </div>
                </td>
                <td>
                  {format(new Date(order.node.updatedAt), "d/M/Y KK:maaa")}
                </td>
                <td>
                  {order.node.lineItems.edges.reduce(
                    (prevValue, currItem) =>
                      prevValue + Number(currItem.node.quantity),
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
                        {order.node.lineItems.edges.length} items
                      </Button>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <ul>
                        {order.node.lineItems.edges.map((item, i) => {
                          return (
                            <li key={`${item.node.id}-${i}`}>
                              {item.node.name} x {item.node.quantity}
                            </li>
                          );
                        })}
                      </ul>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
