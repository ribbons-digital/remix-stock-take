import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

export default function OrdersByProductCard({
  products,
}: {
  products: {
    _id: string;
    name: string;
    orders: number;
  }[];
}) {
  return (
    <BarChart width={430} height={250} data={products}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" hide></XAxis>
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="orders" fill="#8884d8" />
    </BarChart>
  );
}
