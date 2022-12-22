import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { getProducts, updateProductItemsQuantity } from "~/api/product";
import type { ProductType } from "~/types";

import { Button, Table, TextInput } from "@mantine/core";

export const loader: LoaderFunction = async () => {
  const products = await getProducts();

  return json(products);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const productId = form.get("update") as string;

  const newQuantity = form.get(`item-quantity-${productId}`) as string;

  await updateProductItemsQuantity(productId, Number(newQuantity));

  return redirect("/products");
};

export default function ProductsIndex() {
  const products = useLoaderData<ProductType[]>();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Link to="/products/new">
          <Button variant="outline">+ Add New Product</Button>
        </Link>
      </div>

      <fetcher.Form method="post">
        <Table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Orders</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              return (
                <tr key={product._id}>
                  <td>
                    <Link to={`/products/${product._id}`}>
                      <div className="underline underline-offset-1 text-blue-700">
                        {product.name}
                      </div>
                    </Link>
                  </td>
                  <td>
                    {product.orders && product.orders.length > 0 ? (
                      <Link to={`/products/${product._id}.orders`}>
                        <div className="underline underline-offset-1 text-blue-700">
                          {product.orders.length}
                        </div>
                      </Link>
                    ) : (
                      <div>0</div>
                    )}
                  </td>
                  <td>
                    <>
                      <label htmlFor={`item-quantity-${product._id}`} />
                      <TextInput
                        id={`item-quantity-${product._id}`}
                        name={`item-quantity-${product._id}`}
                        type="number"
                        defaultValue={
                          product.items && product.items.length === 1
                            ? product.items[0].quantity
                            : product.items && product.items.length > 1
                            ? String(
                                Math.min(
                                  ...product.items.map((item) =>
                                    Number(item.quantity)
                                  )
                                )
                              )
                            : "0"
                        }
                        disabled={product.name.toLowerCase().includes("kit")}
                      />
                    </>
                  </td>
                  <td>
                    {!product.name.toLowerCase().includes("kit") && (
                      <Button
                        radius={50}
                        type="submit"
                        name="update"
                        value={product._id}
                      >
                        {fetcher.submission?.formData.get("update") ===
                        product._id
                          ? "Updating..."
                          : "Update"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </fetcher.Form>
    </div>
  );
}
