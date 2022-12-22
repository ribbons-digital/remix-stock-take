import type { SanityDocumentStub } from "@sanity/client";
import { sdk } from "~/services/graphql";
import type {
  CreateProductParamsType,
  ItemsInProductResponseType,
  OrdersInProductResponseType,
  ProductType,
  UpdateProductOrdersParamsType,
} from "~/types";

import { sanity } from "../utils/sanity-client";

export const getProducts = async () => {
  // const query =
  // '*[_type == "product"]{ _id, _key, name, quantity, "items": *[_type=="item" && references(^._id)]{ _id, name, quantity }, "orders": *[_type=="order" && references(^._id)]{ _id, orderNumber } }';
  const query =
    '*[_type == "product"]{ _id, name, orders, price, items[]->{_id, quantity} }';
  return await sanity.fetch(query);
};

export const getShopifyProducts = async () => {
  return await sdk.Products({ first: 10 });
};

export const getOrdersInProductByDateRange = async (
  startDate: string,
  endDate: string
) => {
  const query = `*[_type == "product" && count(orders[]) > 0]{
    _id, name, 
    "orders": *[_type == "order" && date > "${startDate}" && date < "${endDate}"  && references(^._id)]{
      _id, updatedAt, date
    }
  }`;

  return await sanity.fetch(query);
};

export const getProduct = async ({ id }: { id: string }) => {
  // const query = `*[_type == "product" && _id == "${id}"]{ _id, _key, name, quantity, "items": *[_type=="item" && references(^._id)]{ _id, name, quantity }, "orders": *[_type=="order" && references(^._id)]{ _id, orderNumber } }`;
  const query = `*[_type == "product" && _id == "${id}"]{ _id, _key, name, price,isKit, items[]->{_id, _key, name, quantity}, orders[]->{_id, orderNumber} }`;
  return await sanity.fetch(query);
};

export const getItemsInProduct = async ({
  id,
}: {
  id: string;
}): Promise<ItemsInProductResponseType[]> => {
  // const query = `*[_type == "product" && _id == "${id}"]{ _id, _key, name, quantity, "items": *[_type=="item" && references(^._id)]{ _id, name, quantity }, "orders": *[_type=="order" && references(^._id)]{ _id, orderNumber } }`;
  const query = `*[_type == "product" && _id == "${id}"]{ _id, items[]->{_id, quantity} }`;
  return await sanity.fetch(query);
};

export const getOrdersInProduct = async ({
  id,
}: {
  id: string;
}): Promise<OrdersInProductResponseType[]> => {
  const query = `*[_type == "product" && _id == "${id}"]{ _id, orders[]->{_id, orderNumber, date, orderedItems[]{ _id, quantity, orderedItem->{_id, name }} }}`;
  return await sanity.fetch(query);
};

export const createProduct = async ({
  name,
  isKit = false,
  price = 0,
}: CreateProductParamsType) => {
  const product: SanityDocumentStub = {
    _type: "product",
    name,
    isKit,
    price,
  };
  return await sanity.create(product, {
    autoGenerateArrayKeys: true,
  });
};

export const updateProductItemsQuantity = async (
  id: string,
  quantity: number
) => {
  const items = await getProduct({ id }).then(
    (products: ProductType[]) => products[0].items
  );

  return await Promise.all(
    items.map((item) => {
      return sanity.patch(item._id!, { set: { quantity } }).commit();
    })
  );
};

// export const updateProductQuantity = async ({
//   _id,
//   quantity,
// }: {
//   _id: string;
//   quantity: number;
// }) => {
//   const product = await sanity.patch(_id, { set: { quantity } }).commit();

//   return product;
// };

export const updateOrdersInProduct = async ({
  productId,
  orders,
}: UpdateProductOrdersParamsType) => {
  // await sanity.patch(productId).unset(["orders"]).commit();
  return await Promise.all(
    orders.map((order) => {
      return sanity
        .patch(productId)
        .setIfMissing({ orders: [] })
        .insert("after", "orders[-1]", [order])
        .commit({ autoGenerateArrayKeys: true });
    })
  );
};

export const updateProduct = async ({
  id,
  name,
  isKit = false,
  price = 0,
}: {
  id: string;
  name: string;
  isKit: boolean;
  price: number;
}) => {
  const product = await sanity
    .patch(id, { set: { name, isKit, price } })
    .commit();

  return product;
};

export const deleteProduct = async ({ id }: { id: string }) => {
  if (!id) return { error: "Please provide object with id key" };
  return await sanity.delete(id);
};

export const deleteItemInProduct = async ({
  id,
  index,
}: {
  id: string;
  index: number;
}) => {
  const itemToRemove = [`items[${index}]`];
  await sanity.patch(id).unset(itemToRemove).commit();
};

export const addItemInProduct = async ({
  id,
  itemRef,
}: {
  id: string;
  itemRef: {
    _type: string;
    _ref: string;
  }[];
}) => {
  await sanity
    .patch(id)
    .setIfMissing({ items: [] })
    .append("items", itemRef)
    .commit({ autoGenerateArrayKeys: true });
};
