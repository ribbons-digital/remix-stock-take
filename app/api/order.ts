import type { SanityDocumentStub } from "@sanity/client";
import type { CreateOrderParamsType } from "~/types";

import { sanity } from "../utils/sanity-client";

export const getOrders = async () => {
  const query =
    '*[_type == "order"]{ _id, _key, orderedItems[]{ orderedItem->{_id, name}, quantity } , date}';
  return await sanity.fetch(query);
};

export const getOrder = async (id: string) => {
  const query = `*[_type == "order" && _id == "${id}"]{ _id, _key, orderedItems[]{ orderedItem->{_id, name}, quantity } , date}`;
  return await sanity.fetch(query);
};

export const createOrder = async ({
  orderedItems,
  date,
}: CreateOrderParamsType) => {
  const order: SanityDocumentStub = {
    _type: "order",
    orderedItems,
    date,
  };
  return await sanity.create(order, {
    autoGenerateArrayKeys: true,
  });
};
