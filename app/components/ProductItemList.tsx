import type { SelectChangeEvent } from "@mui/material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import type { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useTransition } from "@remix-run/react";
import React from "react";
import { deleteItemInProduct } from "~/api/product";
import type { ItemType } from "~/types";

type ProductItemListProps = {
  currentProductItems: ItemType[];
  allProductItems: ItemType[];
  productId: string;
};

export default function ProductItemList({
  currentProductItems,
  allProductItems,
  productId,
}: ProductItemListProps) {
  const [items, setItems] = React.useState<ItemType[]>(currentProductItems);
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");

  React.useEffect(() => {
    setItems(currentProductItems);
  }, [currentProductItems]);

  const columns: GridColDef[] = React.useMemo(() => {
    return [
      {
        field: "itemName",
        headerName: "Item Name",
        flex: 600,
        valueGetter: (params: GridValueGetterParams) => params.row.name,
      },
      {
        field: "quantity",
        headerName: " Quantity",
        flex: 100,
        valueGetter: (params: GridValueGetterParams) => params.row.quantity,
      },
      {
        field: "action",
        headerName: "Action",

        flex: 120,
        renderCell: (cellValues) => {
          return (
            <button
              className="rounded-full bg-red-500 pl-3 pr-3 text-white text-center"
              name="deleteItem"
              type="submit"
              value={JSON.stringify({
                itemId: cellValues.id,
                items,
                productId,
              })}
              //   onClick={async () => {
              //     console.log(items);
              //     const newItemList = items.filter(
              //       (item) => item._id !== cellValues.id
              //     );
              //     const index = items.findIndex(
              //       (item) => item._id === cellValues.id
              //     );
              //     // await deleteItemInProduct({ id: productId, index });

              //     console.log(cellValues);

              //     setItems(newItemList);
              //   }}
            >
              Delete
            </button>
          );
        },
      },
    ];
  }, [items, productId]);

  const handleSelectItem = (event: SelectChangeEvent) => {
    setSelectedItemId(event.target.value);
  };

  const transition = useTransition();

  return (
    <>
      <FormControl sx={{ py: 1, width: "100%" }}>
        <InputLabel id="demo-simple-select-helper-label">Item</InputLabel>
        <Select
          labelId="selected-item"
          id="selected-item"
          value={selectedItemId}
          label="Item"
          onChange={handleSelectItem}
        >
          {allProductItems.map((item, i) => (
            <MenuItem value={item._id} key={item._id}>
              <em>{item.name}</em>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <input type="hidden" name="items" defaultValue={JSON.stringify(items)} />
      <Button
        className="w-full mb-4"
        variant="outlined"
        name="addItem"
        type="submit"
        value={selectedItemId}
        disabled={!selectedItemId}
        // onClick={onUpdateItemList}
      >
        + Add Item
      </Button>

      {items.length > 0 && (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={items}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15]}
            getRowId={(row) => row._id!}
            loading={transition.state === "submitting"}
          />
        </div>
      )}
    </>
  );
}
