import { Box, Button, Modal, Table } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { getOrdersInProduct } from "~/api/product";
import type { OrderType } from "~/types";

import { groupBy } from "~/utils";
import { getWeek } from "date-fns";

export const loader: LoaderFunction = async ({ request, params }) => {
  const productId = params.product;
  const ordersInProduct = await getOrdersInProduct({ id: productId! });

  const weeksArr = ordersInProduct[0].orders.map((order) => {
    getWeek(new Date(order.date));
    return {
      week: String(getWeek(new Date(order.date))),
      order,
    };
  });

  return Object.values(groupBy(weeksArr, (obj) => obj.week));
};

type LoaderData = {
  week: string;
  order: OrderType;
}[];

export default function ProductOrders() {
  const params = useParams();
  const navigate = useNavigate();
  const orders = useLoaderData<LoaderData[]>();

  return (
    <Modal
      withinPortal={false}
      centered
      opened={Boolean(params.product)}
      onClose={() => navigate(-1)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {orders.map((weeklyOrders, i) => {
          return (
            <div
              key={i}
              style={{
                marginBottom: "1rem",
              }}
            >
              <h1
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Week {weeklyOrders[0].week}
              </h1>
              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                {weeklyOrders.length} order(s)
              </div>
              <div style={{ height: 200, width: "100%" }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Ordered Date</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyOrders.map((order, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <Link to={`/orders/${order.order._id}`}>
                              {order.order.orderNumber}
                            </Link>
                          </td>
                          <td>{order.order.date}</td>
                          <td>
                            {order.order.orderedItems.reduce(
                              (prevValue, currItem) =>
                                prevValue + Number(currItem.quantity),
                              0
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
