import type { LoaderFunction } from "@remix-run/node";
import { Button, Table } from "@mantine/core";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { getOrders } from "~/api/order";

import type { OrderItemType, OrderType } from "~/types";

export const loader: LoaderFunction = async () => {
  const orders = await getOrders();

  return orders;
};

// const columns: GridColDef[] = [
//   {
//     field: "orderNumber",
//     headerName: "Order Number",
//     flex: 60,
//     renderCell: (cellValues) => {
//       return (
//         <Link to={`/orders/${cellValues.id as string}`}>
//           <div className="underline underline-offset-1 text-blue-700">
//             {cellValues.row.orderNumber}
//           </div>
//         </Link>
//       );
//     },
//   },
//   {
//     field: "orderedDate",
//     headerName: "Ordered Date",
//     flex: 15,
//     valueGetter: (params: GridValueGetterParams) => params.row.date,
//   },
//   {
//     field: "quantity",
//     headerName: "Quantity",
//     valueGetter: (params: GridValueGetterParams) => {
//       const orderedItems = params.row.orderedItems as OrderItemType[];
//       return orderedItems.reduce(
//         (prevValue, currItem) => prevValue + Number(currItem.quantity),
//         0
//       );
//     },
//   },
// ];

export default function OrdersIndex() {
  const orders = useLoaderData<OrderType[]>();
  const navigate = useNavigate();

  const goToNewOrder = () => {
    navigate("/orders/new");
  };
  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Button type="button" onClick={goToNewOrder}>
          + Add New Order
        </Button>
      </div>
      <div style={{ height: 800, width: "100%" }}>
        <Table>
          <thead>
            <tr>
              <th>Order number</th>
              <th>Order date</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td>
                    <Link to={`/orders/${order._id}`}>{order.orderNumber}</Link>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    {order.orderedItems.reduce(
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
}
