import { Button, Card, Text, Menu, Title } from "@mantine/core";
import { NavLink } from "@remix-run/react";

export default function TotalInventoryValueCard() {
  return (
    <Card
      sx={{ minWidth: 300, minHeight: 200 }}
      className="flex flex-col justify-between"
    >
      <Card.Section className="flex justify-between p-2">
        <Title>Total Inventory Value</Title>
      </Card.Section>
      <Card.Section className="flex flex-col items-center">
        <Text className="text-3xl font-extrabold">$43.984</Text>
        <Text>to date</Text>
      </Card.Section>

      <Card.Section className="flex justify-end p-2">
        <NavLink to="#" className="underline">
          Learn More
        </NavLink>
      </Card.Section>
    </Card>
  );
}
