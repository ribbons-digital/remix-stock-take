import type {
  OrderItemParamsType,
  OrderType,
  OrderItemType,
  ProductType,
  OrderResponseType,
  ItemType,
} from "~/types";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getItemsInProduct, getProducts } from "~/api/product";
import { useLoaderData } from "@remix-run/react";

import { createOrder, getOrder, updateOrder } from "~/api/order";
import OrderForm from "~/components/OrderForm";
import { deleteItem, updateItemQuantity } from "~/api/item";

export const loader: LoaderFunction = async ({ request, params }) => {
  const products = await getProducts();
  const order = await getOrder(params.order!);

  const updatedOrderedItems = order[0].orderedItems.map((item, i) => {
    return {
      ...item,
      orderedItem: {
        ...item.orderedItem,
        _id: `${item.orderedItem._id}.${i}`,
      },
    };
  });

  const updatedOrder = [
    {
      ...order[0],
      orderedItems: updatedOrderedItems,
    },
  ];

  return json({
    products,
    order: updatedOrder[0],
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("orderDate") as string;
  const orderId = form.get("orderId") as string;
  const deleteOrder = form.get("delete") as string;
  const orderNumber = form.get("orderNumber") as string;
  const orderedItemsJsonString = form.get("orderedItems") as string;
  const items = JSON.parse(orderedItemsJsonString) as OrderItemType[];

  if (deleteOrder) {
    await deleteItem({ id: orderId });
    return redirect("/orders");
  } else {
    const orderedItems = items.map((item) => {
      return {
        orderedItem: {
          _type: "reference",
          _ref: item.orderedItem._id?.split(".")[0],
        },
        note: item.note,
        quantity: item.quantity,
      };
    }) as OrderItemParamsType[];

    if (orderId) {
      await updateOrder({
        orderId,
        orderNumber,
        orderedItems,
        date,
      });

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
                  quantity:
                    Number(itemInProduct.quantity) - Number(item.quantity),
                });
              }
            )
          );
        })
      );
    } else {
      await createOrder({
        orderNumber,
        orderedItems,
        date,
      });
    }

    return redirect("/orders");
  }
};

type LoaderData = {
  products: ProductType[];
  order: OrderType;
};

export default function NewOrderRoute() {
  const { products, order } = useLoaderData<LoaderData>();

  return <OrderForm products={products} order={order} />;
}
