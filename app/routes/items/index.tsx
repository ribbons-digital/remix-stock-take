import React from "react";
import { Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { getItems, updateItem } from "~/api/item";
import type { ItemType } from "~/types";

export const loader: LoaderFunction = async () => {
  const items = await getItems();
  return items;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const { id, name, cost } = JSON.parse(form.get("update") as string);

  const quantity = Number(form.get(`quantity-${id}`) as string);

  await updateItem({
    id,
    name,
    quantity,
    cost,
  });

  return redirect("/items");
};

const columns: GridColDef[] = [
  {
    field: "itemName",
    headerName: "Item Name",
    flex: 60,
    // valueGetter: (params: GridValueGetterParams) => params.row.name,
    renderCell: (cellValues) => {
      return (
        <Link to={`/items/${cellValues.id as string}`}>
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
          <label htmlFor={`quantity-${cellValues.id}`} />
          <input
            className="border-1 w-full"
            id={`quantity-${cellValues.id}`}
            name={`quantity-${cellValues.id}`}
            defaultValue={cellValues.row.quantity}
            type="number"
          />
        </>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    flex: 10,
    renderCell: (cellValues) => {
      return (
        <button
          className="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center"
          type="submit"
          name="update"
          value={JSON.stringify({
            id: cellValues.id,
            name: cellValues.row.name,
            quantity: cellValues.row.quantity,
            cost: cellValues.row.cost,
            inProduct: cellValues.row.inProduct,
          })}
        >
          Update
        </button>
      );
    },
  },
];

export default function ItemsRoute() {
  const items = useLoaderData<ItemType[]>();
  const transition = useTransition();
  const dollarAUD = Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "AUD",
  });

  const inventoryValue = React.useMemo(() => {
    return items
      .map((item) => item.quantity * item.cost)
      .reduce((a, b) => a + b, 0);
  }, [items]);

  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-between mb-6">
        <h1>Inventory value: {dollarAUD.format(inventoryValue)}</h1>
        <Link to="/items/new">
          <Button type="button" variant="contained">
            + Add New Item
          </Button>
        </Link>
      </div>
      <Form method="post">
        <div style={{ height: 800, width: "100%" }}>
          <DataGrid
            rows={items}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15]}
            getRowId={(row) => row._id}
            loading={
              transition.state === "loading" ||
              transition.state === "submitting"
            }
          />
        </div>
      </Form>
    </div>
  );
}
