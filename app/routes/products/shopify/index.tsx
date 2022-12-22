import { Table } from "@mantine/core";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProductsQuery } from "~/graphql/generated/graphql";
import { getShopifyProducts } from "~/api/product";

export const loader: LoaderFunction = async () => {
  return await getShopifyProducts();
};

export default function ShopifyIndexRoute() {
  const { products } = useLoaderData<ProductsQuery>();
  return (
    <div className="flex flex-col mx-auto max-w-4xl p-4">
      <Table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Variants</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.edges.map((product) => {
            return (
              <tr key={product.node.id}>
                <td>
                  <div className="underline underline-offset-1 text-blue-700">
                    {product.node.id}
                  </div>
                </td>
                <td>{product.node.title}</td>
                <td>
                  <ul>
                    {product.node.variants.edges.map((variant) => {
                      return (
                        <li key={variant.node.id}>
                          {variant.node.displayName} -{" "}
                          {variant.node.inventoryQuantity}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>{product.node.totalInventory}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
