import { GraphQLClient } from "graphql-request";
import { getSdk } from "~/graphql/generated/graphql";

export const client = new GraphQLClient(
  "https://nomad-nature.myshopify.com/admin/api/2022-10/graphql.json",
  {
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!,
    },
  }
);

export const sdk = getSdk(client);
