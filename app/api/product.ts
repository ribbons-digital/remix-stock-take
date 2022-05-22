import type { SanityDocumentStub } from "@sanity/client";
import type { ProductType } from "~/types";

import { sanity } from "../utils/sanity-client";

export const getProducts = async () => {
  const query =
    '*[_type == "product"]{ _id, name, quantity, "items": *[_type=="item" && references(^._id)]{ _id, name, quantity } }';
  return await sanity.fetch(query);
};

export const getProduct = async (id: string) => {
  const query = `*[_type == "product" && _id == "${id}"]{ _id, quantity, "items": *[_type=="item" && references(^._id)]{ _id, quantity } }`;
  return await sanity.fetch(query);
};

export const createProduct = async ({ name, quantity, items }: ProductType) => {
  const product: SanityDocumentStub = {
    _type: "product",
    name,
    quantity,
    items,
  };
  return await sanity.create(product);
};

export const updateProductItemsQuantity = async (
  id: string,
  quantity: number
) => {
  const items = await getProduct(id).then(
    (products: ProductType[]) => products[0].items
  );
  console.log(items);
  await Promise.all(
    items.map((item) => {
      return sanity
        .patch(item._id, { set: { quantity: item.quantity + quantity } })
        .commit();
    })
  );
  return items;
};

export const updateProductQuantity = async ({
  _id,
  quantity,
}: {
  _id: string;
  quantity: number;
}) => {
  const product = await sanity.patch(_id, { set: { quantity } }).commit();

  return product;
};

export const deleteProduct = async ({ id }: { id: string }) => {
  if (!id) return { error: "Please provide object with id key" };
  return await sanity.delete(id);
};
