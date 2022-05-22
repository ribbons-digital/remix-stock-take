export type ProductType = {
  _id: string;
  name: string;
  quantity: number;
  items: ItemType[];
};

export type OrderType = {
  _id: string;
  orderedItems: OrderItemType[];
  date: Date;
};

export type ItemType = {
  _id: string;
  quantity: number;
  orderedItem: Omit<ProductType, "items">;
};

export type OrderItemType = {
  orderedItem: ProductType;
  quantity: number;
};
