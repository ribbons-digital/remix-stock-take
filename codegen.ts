import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "https://nomad-nature.myshopify.com/admin/api/2022-10/graphql.json": {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      },
    },
  ],
  documents: "./app/graphql/**/*.graphql",
  generates: {
    "./app/graphql/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
