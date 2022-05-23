import type { SanityDocumentStub } from "@sanity/client";
import type { OrderType } from "~/types";

import { sanity } from "../utils/sanity-client";

export const getOrders = async () => {
  const query =
    '*[_type == "order"]{ _id, _key, orderedItems[]{ orderedItem->{_id, name}, quantity } , date}';
  return await sanity.fetch(query);
};

export const createOrder = async ({ orderedItems, date }: OrderType) => {
  const order: SanityDocumentStub = {
    _type: "order",
    orderedItems,
    date,
  };
  return await sanity.create(order, {
    autoGenerateArrayKeys: true,
  });
};
