import { Card, Button, Text, Title } from "@mantine/core";

export default function TopThreeSellerCard() {
  return (
    <Card
      sx={{ minWidth: 300, minHeight: 200 }}
      className="flex flex-col justify-between"
    >
      <Card.Section className="flex justify-between p-2">
        <Title>Top 3 Sellers</Title>
      </Card.Section>
      <div className="flex items-center w-full justify-between">
        <Text>Omnia Oven</Text>

        <Text>20</Text>
      </div>
      <div className="flex items-center w-full justify-between">
        <Text>MoonShade</Text>

        <Text>15</Text>
      </div>
      <div className="flex items-center w-full justify-between">
        <Text>Haven XL - Forest Camo</Text>

        <Text>12</Text>
      </div>
    </Card>
  );
}
