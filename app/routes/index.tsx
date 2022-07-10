import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { getMonthlyOrders, getOrdersByDateRange } from "~/api/order";
import { getOrdersInProductByDateRange } from "~/api/product";
import ResponsiveAppBar from "~/components/AppBar";
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

  let session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  } else {
    // otherwise execute the query for the page, but first get token
    const { user, error: sessionErr } = await supabase.auth.api.getUser(
      session.get("access_token")
    );

    if (!user) {
      let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/login?${searchParams}`, {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    // if no error then get then set authenticated session
    // to match the user associated with the access_token
    if (!sessionErr) {
      // activate the session with the auth_token
      supabase.auth.setAuth(session.get("access_token"));
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
      return { user, orders, products, ordersByMonth, ordersByProduct };
    } else {
      return { error: sessionErr };
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
    <div>
      <ResponsiveAppBar user={user} />
      <Container>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <TotalOrdersCard orders={orders} />
          </Grid>
          <Grid item md={4} xs={12}>
            <TopThreeSellerCard />
          </Grid>
          <Grid item md={4} xs={12}>
            <TotalInventoryValueCard />
          </Grid>
        </Grid>
        <Grid container spacing={2} className="mt-8">
          <Grid item md={6} xs={12}>
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Monthly Orders
                  </Typography>
                }
              />
              <CardContent>
                <MonthlyOrderLineChart ordersByMonth={ordersByMonth} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Orders by Product
                  </Typography>
                }
              />
              <CardContent>
                <OrdersByProductCard products={ordersByProduct} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
