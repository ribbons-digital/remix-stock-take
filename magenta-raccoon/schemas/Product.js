export default {
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "orders",
      type: "array",
      title: "Orders",
      of: [
        {
          type: "reference",
          to: [{ type: "order" }],
        },
      ],
    },
    {
      name: "isKit",
      type: "boolean",
      title: "Is this a Kit",
      initialValue: false,
    },
    {
      name: "shopifyId",
      type: "string",
      title: "Shopify ID",
    },
    {
      name: "shopifyVariantId",
      type: "string",
      title: "Shopify Variant ID",
    },
    {
      name: "price",
      type: "number",
      initialValue: 0,
    },
    {
      name: "items",
      type: "array",
      title: "Items",
      of: [
        {
          type: "reference",
          to: [{ type: "item" }],
        },
      ],
    },
  ],
};
