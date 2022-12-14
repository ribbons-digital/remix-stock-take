import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import { getProducts, updateProductItemsQuantity } from "~/api/product";
import type { ProductType } from "~/types";

import { Button, Table } from "@mantine/core";

import React from "react";

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
  const transition = useTransition();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Link to="/products/new">
          <Button variant="default">+ Add New Product</Button>
        </Link>
      </div>

      <fetcher.Form method="post">
        <div style={{ height: 800, width: "100%" }}>
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
                        <button
                          className="underline underline-offset-1 text-blue-700"
                          name="orders"
                          type="button"
                          onClick={() =>
                            navigate(`/products/${product._id}.orders`)
                          }
                        >
                          {product.orders.length}
                        </button>
                      ) : (
                        <div>0</div>
                      )}
                    </td>
                    <td>
                      <>
                        <label htmlFor={`item-quantity-${product._id}`} />
                        <input
                          className="border-1 w-full"
                          id={`item-quantity-${product._id}`}
                          name={`item-quantity-${product._id}`}
                          type="number"
                          defaultValue={
                            product.items && product.items.length === 1
                              ? product.items[0].quantity
                              : "0"
                          }
                          disabled={product.name.toLowerCase().includes("kit")}
                        />
                      </>
                    </td>
                    <td>
                      {!product.name.toLowerCase().includes("kit") && (
                        <button
                          className="rounded-full bg-blue-500 p-2 text-white text-center"
                          type="submit"
                          name="update"
                          value={product._id}
                        >
                          {fetcher.submission?.formData.get("update") ===
                          product._id
                            ? "Updating..."
                            : "Update"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </fetcher.Form>
    </div>
  );
}
