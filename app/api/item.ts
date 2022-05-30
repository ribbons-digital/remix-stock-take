import type { SanityDocumentStub } from "@sanity/client";
import type { CreateItemParamsType, ItemType } from "~/types";

import { sanity } from "../utils/sanity-client";

export const getItems = async () => {
  const query =
    '*[_type == "item"]{ _id, _key, name, quantity, "inProduct": *[_type=="product" && references(^._id)]{ _id, name } }';
  return await sanity.fetch(query);
};

export const getItem = async (id: string) => {
  const query = `*[_type == "item" && _id == "${id}"]{ _id, _key, name, quantity, "inProduct": *[_type=="product" && references(^._id)]{ _id, name } }`;
  return await sanity.fetch(query);
};

export const createItem = async ({ name, quantity }: CreateItemParamsType) => {
  const item: SanityDocumentStub = {
    _type: "item",
    name,
    quantity,
  };
  return await sanity.create(item, {
    autoGenerateArrayKeys: true,
  });
};

export const updateItem = async ({
  id,
  name,
  quantity,
  inProduct,
}: {
  id: string;
  name: string;
  quantity: number;
  inProduct?: {
    _type: string;
    _ref: string;
  }[];
}) => {
  let item;
  if (inProduct) {
    item = await sanity
      .patch(id, { set: { name, quantity, inProduct } })
      .commit();
  } else {
    item = await sanity.patch(id, { set: { name, quantity } }).commit();
  }
  return item;
};

export const updateItemQuantity = async ({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) => {
  const item = await sanity.patch(id, { set: { quantity } }).commit();
  return item;
};

export const deleteItem = async ({ id }: { id: string }) => {
  if (!id) return { error: "Please provide object with id key" };
  return await sanity.delete(id);
};
