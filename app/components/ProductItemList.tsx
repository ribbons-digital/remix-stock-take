import { Table, Button, Select } from "@mantine/core";
import { Fetcher, useFetcher, useTransition } from "@remix-run/react";
import React from "react";
import type { ItemType } from "~/types";

type ProductItemListProps = {
  currentProductItems: ItemType[];
  allProductItems: ItemType[];
  productId: string;
  fetcher: Fetcher;
};

export default function ProductItemList({
  currentProductItems,
  allProductItems,
  productId,
  fetcher,
}: ProductItemListProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");

  const isAdding =
    fetcher.submission?.formData.get("addItem") === selectedItemId;

  React.useEffect(() => {
    if (!isAdding) {
      setSelectedItemId("");
    }
  }, [isAdding]);
  return (
    <>
      <Select
        id="selected-item"
        value={selectedItemId}
        label="Item"
        onChange={(value) => setSelectedItemId(value ?? "")}
        data={allProductItems.map((item) => ({
          label: item.name,
          value: item._id!,
        }))}
      />
      <input
        type="hidden"
        name="items"
        defaultValue={JSON.stringify(currentProductItems)}
      />
      <Button
        className="w-full mb-4 mt-2"
        name="addItem"
        color="blue"
        variant="outline"
        type="submit"
        value={selectedItemId}
        disabled={!selectedItemId}
        // onClick={onUpdateItemList}
      >
        {isAdding ? "Adding..." : "+ Add Item"}
      </Button>

      {currentProductItems ? (
        <div style={{ height: 600, width: "100%" }}>
          <Table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProductItems.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        className="rounded-full bg-red-500 p-1 text-white text-center"
                        name="deleteItem"
                        type="submit"
                        value={JSON.stringify({
                          itemId: item._id,
                          items: currentProductItems,
                          productId,
                        })}
                      >
                        {fetcher.submission?.formData.get("deleteItem") &&
                        JSON.parse(
                          fetcher.submission?.formData.get(
                            "deleteItem"
                          ) as string
                        ).itemId === item._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
    </>
  );
}
