export type ProductType = {
  _id?: string;
  _key?: string;
  name: string;
  quantity: number;
  items: ItemType[];
};

export type OrderType = {
  _id?: string;
  _key?: string;
  orderedItems: OrderItemType[];
  date: string;
};

export type ItemType = {
  _id?: string;
  _key?: string;
  quantity: number;
  orderedItem: Omit<ProductType, "items">;
};

export type OrderItemType = {
  orderedItem: ProductType;
  quantity: number;
};

export type OrderItemParamsType = {
  orderedItem: {
    _ref: string;
    _type: string;
  };
  quantity: number;
};

export type CreateOrderParamsType = {
  orderedItems: OrderItemParamsType[];
  date: string;
};
