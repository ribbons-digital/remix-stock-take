import React from "react";
import { Button, Table, TextInput } from "@mantine/core";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { getItems, updateItem } from "~/api/item";
import type { ItemType } from "~/types";

export const loader: LoaderFunction = async () => {
  const items = await getItems();
  return items;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const { id, name, cost } = JSON.parse(form.get("update") as string);

  const quantity = Number(form.get(`quantity-${id}`) as string);

  await updateItem({
    id,
    name,
    quantity,
    cost,
  });

  return redirect("/items");
};

export default function ItemsRoute() {
  const items = useLoaderData<ItemType[]>();
  const transition = useTransition();
  const dollarAUD = Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "AUD",
  });

  const inventoryValue = React.useMemo(() => {
    return items
      .map((item) => item.quantity * item.cost)
      .reduce((a, b) => a + b, 0);
  }, [items]);

  return (
    <div className="flex flex-col mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-between mb-6">
        <h1>Inventory value: {dollarAUD.format(inventoryValue)}</h1>
        <Link to="/items/new">
          <Button type="button">+ Add New Item</Button>
        </Link>
      </div>
      <Form method="post">
        <Table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Cost</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Link to={`/items/${item._id as string}`}>
                      <div className="underline underline-offset-1 text-blue-700">
                        {item.name}
                      </div>
                    </Link>
                  </td>
                  <td>${item.cost}/item</td>
                  <td>
                    <TextInput
                      id={`quantity-${item._id}`}
                      name={`quantity-${item._id}`}
                      defaultValue={item.quantity}
                      type="number"
                    />
                  </td>
                  <td>
                    <Button
                      type="submit"
                      name="update"
                      radius={50}
                      value={JSON.stringify({
                        id: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        cost: item.cost,
                        inProduct: item.inProduct,
                      })}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Form>
    </div>
  );
}
