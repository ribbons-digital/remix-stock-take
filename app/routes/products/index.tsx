import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import { getProducts, updateProductItemsQuantity } from "~/api/product";
import type { ProductType } from "~/types";

import Button from "@mui/material/Button";
import type { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

import React from "react";

export const loader: LoaderFunction = async () => {
  const products = await getProducts();

  return json(products);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const productId = form.get("update") as string;

  const newQuantity = form.get(`item-quantity-${productId}`) as string;
  console.log({ newQuantity });

  await updateProductItemsQuantity(productId, Number(newQuantity));

  return redirect("/products");
};

export default function ProductsIndex() {
  const products = useLoaderData<ProductType[]>();
  const transition = useTransition();
  const navigate = useNavigate();

  const columns: GridColDef[] = React.useMemo(() => {
    return [
      {
        field: "product",
        headerName: "Product",
        flex: 60,
        // valueGetter: (params: GridValueGetterParams) => params.row.name,
        renderCell: (cellValues) => {
          return (
            <Link to={`/products/${cellValues.id as string}`}>
              <div className="underline underline-offset-1 text-blue-700">
                {cellValues.row.name}
              </div>
            </Link>
          );
        },
      },
      {
        field: "quantity",
        headerName: "Quantity",
        flex: 10,
        // editable: true,
        // valueGetter: (params: GridValueGetterParams) => params.row.quantity,
        renderCell: (cellValues) => {
          return (
            <>
              <label htmlFor={`item-quantity-${cellValues.id}`} />
              <input
                className="border-1 w-full"
                id={`item-quantity-${cellValues.id}`}
                name={`item-quantity-${cellValues.id}`}
                type="number"
                defaultValue={
                  cellValues.row.items && cellValues.row.items.length === 1
                    ? cellValues.row.items[0].quantity
                    : "0"
                }
                disabled={cellValues.row.name.toLowerCase().includes("kit")}
              />
            </>
          );
        },
      },
      {
        field: "orders",
        headerName: "Orders",
        flex: 10,
        valueGetter: (params: GridValueGetterParams) =>
          params.row.orders ? params.row.orders.length : 0,
        renderCell: (cellValues) => {
          return cellValues.row.orders && cellValues.row.orders.length > 0 ? (
            <button
              className="underline underline-offset-1 text-blue-700"
              name="orders"
              type="button"
              onClick={() => navigate(`/products/${cellValues.id}.orders`)}
            >
              {cellValues.row.orders.length}
            </button>
          ) : (
            <div>0</div>
          );
        },
      },
      {
        field: "action",
        headerName: "Action",

        flex: 10,
        renderCell: (cellValues) => {
          return (
            !cellValues.row.name.toLowerCase().includes("kit") && (
              <button
                className="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center"
                type="submit"
                name="update"
                value={cellValues.id}
              >
                Update
              </button>
            )
          );
        },
      },
    ];
  }, []);

  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Link to="/products/new">
          <Button type="button" variant="contained">
            + Add New Product
          </Button>
        </Link>
      </div>

      <Form method="post">
        <div style={{ height: 800, width: "100%" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15]}
            getRowId={(row) => row._id}
            loading={transition.state === "submitting"}
          />
        </div>
      </Form>
    </div>
  );
}
