import type { SanityDocumentStub } from "@sanity/client";
import type {
  CreateOrderParamsType,
  OrderResponseType,
  OrderType,
  UpdateOrderParamsType,
} from "~/types";

import { GraphQLClient } from "graphql-request";
import { getSdk } from "../graphql/generated/graphql";
import { sanity } from "../utils/sanity-client";
import { sdk } from "~/services/graphql";

export const getOrders = async () => {
  const query =
    '*[_type == "order"] | order(date desc) { _id, _key, orderNumber, orderedItems[]{ orderedItem->{_id, name, price}, quantity } , date}';
  return await sanity.fetch(query);
};

export const getShopifyOrders = async () => {
  return await sdk.Orders({ first: 10, reverse: true });
};

export const getMonthlyOrders = async () => {
  const query = '*[_type == "order"] | order(date asc) { _id, date}';
  return await sanity.fetch(query);
};

export const getOrdersByDateRange = async (
  startDate: string,
  endDate: string
): Promise<OrderType[]> => {
  const query = `*[_type == "order" && date > "${startDate}" && date < "${endDate}" ]{ _id, _key, _updatedAt, orderNumber, orderedItems[]{ orderedItem->{_id, name}, quantity } , date}`;
  return await sanity.fetch(query);
};

export const getOrder = async (id: string): Promise<OrderResponseType[]> => {
  const query = `*[_type == "order" && _id == "${id}"]{ _id, _key, orderNumber, orderedItems[]{ _id, orderedItem->{_id, name, price}, quantity, note } , date}`;
  return await sanity.fetch(query);
};

export const createOrder = async ({
  orderedItems,
  orderNumber,
  date,
}: CreateOrderParamsType) => {
  const order: SanityDocumentStub = {
    _type: "order",
    orderedItems,
    date,
    orderNumber,
  };
  const newOrder = await sanity.create(order, {
    autoGenerateArrayKeys: true,
  });

  return newOrder;
};

export const updateOrder = async ({
  orderId,
  orderedItems,
  date,
  orderNumber,
}: UpdateOrderParamsType) => {
  return await sanity
    .patch(orderId)
    .set({ orderedItems, date, orderNumber })
    .commit({ autoGenerateArrayKeys: true });
};
