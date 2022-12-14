import { Button, Card, Center, Menu, Text, Title } from "@mantine/core";
import { NavLink, useFetcher } from "@remix-run/react";
import { format, subMonths } from "date-fns";
import React from "react";
import type { OrderType } from "~/types";

export default function TotalOrdersCard({ orders }: { orders: OrderType[] }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetcher = useFetcher();

  const fetchLastMonth = () => {
    fetcher.load(`/last_months_orders?startDate=2022-06-01&endDate=2022-06-30`);
    handleClose();
  };

  const fetchLastThreeMonth = () => {
    const currentDate = new Date();
    const now = format(currentDate, "yyyy-MM-dd");
    const previousMonth = format(subMonths(currentDate, 2), "MM");
    fetcher.load(
      `/last_months_orders?startDate=2022-${previousMonth}-01&endDate=${now}`
    );
    handleClose();
  };

  return (
    <Card
      sx={{ minWidth: 300, minHeight: 200 }}
      className="flex flex-col justify-between"
    >
      <Card.Section className="flex justify-between p-2">
        <Title>Total Orders</Title>
        <Menu>
          <Menu.Target>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={fetchLastMonth}>Last month</Menu.Item>
            <Menu.Item onClick={fetchLastThreeMonth}>
              Last three months
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Card.Section>
      <Card.Section className="flex flex-col items-center">
        <Text className="text-3xl font-extrabold">
          {fetcher.data ? fetcher.data.orders.length : orders.length}
        </Text>
        <Text>this month</Text>
      </Card.Section>

      <Card.Section className="flex justify-end p-2">
        <NavLink to="#" className="underline">
          Learn More
        </NavLink>
      </Card.Section>
    </Card>
  );
}
