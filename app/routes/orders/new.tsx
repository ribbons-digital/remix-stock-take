import type { OrderItemParamsType, OrderItemType, ProductType } from "~/types";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getProducts } from "~/api/product";
import { useLoaderData } from "@remix-run/react";

import { createOrder } from "~/api/order";
import OrderForm from "~/components/OrderForm";

export const loader: LoaderFunction = async () => {
  const products = await getProducts();

  return json(products);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("orderDate") as string;
  const orderedItemsJsonString = form.get("orderedItems") as string;
  const items = JSON.parse(orderedItemsJsonString) as OrderItemType[];

  const orderedItems = items.map((item) => {
    return {
      orderedItem: {
        _type: "reference",
        _ref: item.orderedItem._id,
      },
      quantity: item.quantity,
    };
  }) as OrderItemParamsType[];

  await createOrder({
    orderedItems,
    date,
  });

  return redirect("/orders");
};

export default function NewOrderRoute() {
  const products = useLoaderData<ProductType[]>();

  return <OrderForm products={products} />;
}
