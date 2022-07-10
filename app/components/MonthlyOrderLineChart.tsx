import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Month } from "~/routes";

const data = [
  {
    month: "Jan",
    orders: 20,
  },
  {
    month: "feb",
    orders: 30,
  },
  {
    month: "Mar",
    orders: 35,
  },
  {
    month: "Arp",
    orders: 25,
  },
  {
    month: "May",
    orders: 40,
  },
  {
    month: "Jun",
    orders: 60,
  },
];

type PropTypes = {
  ordersByMonth: {
    month: Month;
    orders: number;
  }[];
};

export default function MonthlyOrderLineChart({ ordersByMonth }: PropTypes) {
  return (
    <LineChart width={430} height={250} data={ordersByMonth}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="orders" stroke="#8884d8" />
    </LineChart>
  );
}
