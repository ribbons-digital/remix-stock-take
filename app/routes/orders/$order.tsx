import type {
  OrderItemParamsType,
  OrderType,
  OrderItemType,
  ProductType,
} from "~/types";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getProducts } from "~/api/product";
import { useLoaderData } from "@remix-run/react";

import { createOrder, getOrder } from "~/api/order";
import OrderForm from "~/components/OrderForm";

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log(request);
  console.log(params);
  const products = await getProducts();
  const order = await getOrder(params.order!);

  return json({
    products,
    order,
  });
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

type LoaderData = {
  products: ProductType[];
  order: OrderType[];
};

export default function NewOrderRoute() {
  const { products, order } = useLoaderData<LoaderData>();
  console.log(order);

  return <OrderForm products={products} order={order[0]} />;
}
