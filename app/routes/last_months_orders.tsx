import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getOrdersByDateRange } from "~/api/order";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const startDate = url.searchParams.get("startDate") as string;
  const endDate = url.searchParams.get("endDate") as string;
  const orders = await getOrdersByDateRange(startDate, endDate);
  return json({ orders });
};
