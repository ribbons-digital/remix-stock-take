import { Container, Grid, Card, Text } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { getMonthlyOrders, getOrdersByDateRange } from "~/api/order";
import { getOrdersInProductByDateRange } from "~/api/product";
import ResponsiveAppBar from "~/components/AppBar";
import AppLayout from "~/components/AppLayout";
import MonthlyOrderLineChart from "~/components/MonthlyOrderLineChart";
import OrdersByProductCard from "~/components/OrdersByProductCard";
import TopThreeSellerCard from "~/components/TopThreeSellerCard";
import TotalInventoryValueCard from "~/components/TotalInventoryValueCard";
import TotalOrdersCard from "~/components/TotalOrdersCard";
import { destroySession, getSession } from "~/services/session.server";
import { supabase } from "~/services/supabase";
import type { OrderType, ProductType } from "~/types";
import { groupBy } from "~/utils";

export let loader: LoaderFunction = async ({ request }) => {
  const redirectTo = new URL(request.url).pathname;

  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_PROJ_URL!,
    process.env.SUPABASE_PUBLIC_KEY!,
    { request, response }
  );

  //  let session = await getSession(request.headers.get("Cookie"));
  const { data, error } = await supabaseClient.auth.getSession();

  console.log(data);
  if (!data.session?.user) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  } else {
    // otherwise execute the query for the page, but first get token
    // const {
    //  data: { user },
    //  error,
    // } = await supabase.auth.getUser();

    // if (!data.session?.user) {
    //   let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    //   throw redirect(`/login?${searchParams}`, {
    //     headers: { "Set-Cookie": await destroySession(data.session) },
    //   });
    // }

    // if no error then get then set authenticated session
    // to match the user associated with the access_token
    if (!error) {
      // activate the session with the auth_token

      //      supabase.auth.setAuth(session.get("access_token"));
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const currentMonth = format(new Date(), "MM");
      const currentYear = format(new Date(), "yyyy");

      const orders = await getOrdersByDateRange(
        `${currentYear}-${currentMonth}-01`,
        currentDate
      );

      const monthlyOrders = (await getMonthlyOrders()) as OrderType[];

      const ordersByMonth = Object.entries(
        groupBy(
          monthlyOrders.map((order) => ({
            month: format(new Date(order.date), "MMM"),
          })),
          "month"
        )
      ).map(([key, value]) => ({
        month: key,
        orders: value.length,
      }));

      const ordersInProduct = (await getOrdersInProductByDateRange(
        `${currentYear}-02-01`,
        currentDate
      )) as ProductType[];

      const ordersByProduct = ordersInProduct.map((product) => ({
        _id: product._id,
        name: product.name,
        orders: product.orders.length,
      }));

      const products = (await getOrdersInProductByDateRange(
        `${currentYear}-${currentMonth}-01`,
        currentDate
      )) as ProductType[];

      // return data and any potential errors along with user
      return {
        user: data.session.user,
        orders,
        products,
        ordersByMonth,
        ordersByProduct,
      };
    } else {
      return { error };
    }
  }
};

export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

type LoaderData = {
  user: User;
  orders: OrderType[];
  products: ProductType[];
  // ordersByMonth: {
  //   [month in Month]: {
  //     month: string;
  //   }[];
  // };
  // ordersByMonth: Record<
  //   Month,
  //   {
  //     month: Month;
  //   }[]
  // >;
  ordersByMonth: {
    month: Month;
    orders: number;
  }[];
  ordersByProduct: {
    _id: string;
    name: string;
    orders: number;
  }[];
};

export default function Index() {
  const { user, orders, products, ordersByMonth, ordersByProduct } =
    useLoaderData<LoaderData>();

  return (
    <AppLayout>
      <Grid>
        <Grid.Col lg={4} md={12}>
          <TotalOrdersCard orders={orders} />
        </Grid.Col>
        <Grid.Col lg={4} md={12}>
          <TopThreeSellerCard />
        </Grid.Col>
        <Grid.Col lg={4} md={12}>
          <TotalInventoryValueCard />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <Card>
            <Text>Monly Orders</Text>
            <Card.Section>
              <MonthlyOrderLineChart ordersByMonth={ordersByMonth} />
            </Card.Section>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card>
            <Text>Orders by Product</Text>
            <OrdersByProductCard products={ordersByProduct} />
          </Card>
        </Grid.Col>
      </Grid>
    </AppLayout>
  );
}
