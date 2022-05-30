import type {
  ItemType,
  OrderItemParamsType,
  OrderItemType,
  ProductType,
} from "~/types";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  getItemsInProduct,
  getProducts,
  updateOrdersInProduct,
} from "~/api/product";
import { useLoaderData } from "@remix-run/react";

import { createOrder } from "~/api/order";
import OrderForm from "~/components/OrderForm";
import { updateItemQuantity } from "~/api/item";

export const loader: LoaderFunction = async () => {
  const products = await getProducts();

  return json(products);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("orderDate") as string;
  const orderNumber = form.get("orderNumber") as string;
  const orderedItemsJsonString = form.get("orderedItems") as string;
  const items = JSON.parse(orderedItemsJsonString) as OrderItemType[];

  const orderedItems = items.map((item) => {
    return {
      orderedItem: {
        _type: "reference",
        _ref: item.orderedItem._id?.split(".")[0],
      },
      quantity: item.quantity,
    };
  }) as OrderItemParamsType[];

  const order = await createOrder({
    orderNumber,
    orderedItems,
    date,
  });

  await Promise.all(
    items.map(async (item: OrderItemType) => {
      return await updateOrdersInProduct({
        productId: item.orderedItem._id?.split(".")[0]!,
        orders: [
          {
            _type: "reference",
            _ref: order._id,
          },
        ],
      });
    })
  );

  await Promise.all(
    items.map(async (item: OrderItemType) => {
      const itemsInProduct = await getItemsInProduct({
        id: item.orderedItem._id?.split(".")[0]!,
      });

      await Promise.all(
        itemsInProduct[0].items.map(
          async (
            itemInProduct: Omit<ItemType, "_key" | "name" | "inProduct">
          ) => {
            return await updateItemQuantity({
              id: itemInProduct._id!,
              quantity: Number(itemInProduct.quantity) - Number(item.quantity),
            });
          }
        )
      );
    })
  );
  // {
  //   _createdAt: '2022-05-26T11:40:46Z',
  //   _id: 'GR3T9gaCNB67uk7J6WZNs3',
  //   _rev: 'GR3T9gaCNB67uk7J6WZNn4',
  //   _type: 'order',
  //   _updatedAt: '2022-05-26T11:40:46Z',
  //   date: '2022-05-26',
  //   orderedItems: [
  //     {
  //       _key: 'GR3T9gaCNB67uk7J6WZO21',
  //       orderedItem: [Object],
  //       quantity: 1
  //     }
  //   ]
  // }

  return redirect("/orders");
};

export default function NewOrderRoute() {
  const products = useLoaderData<ProductType[]>();

  return <OrderForm products={products} />;
}
