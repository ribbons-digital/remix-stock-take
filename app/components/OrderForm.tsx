import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { OrderItemType, OrderType, ProductType } from "~/types";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import type { SelectChangeEvent } from "@mui/material";
import { Divider } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { modalStyle } from "~/utils";
import type { OrderActionData } from "~/routes/orders/new";

const modalButtonStyle = {
  display: "flex",
  justifyContent: "end",
};

const columns: GridColDef[] = [
  // {
  //   field: "id",
  //   headerName: "ID",
  //   width: 400,
  //   valueGetter: (params: GridValueGetterParams) => params.row.orderedItem._id,
  // },
  {
    field: "orderedItem",
    headerName: "Product Name",
    flex: 40,
    valueGetter: (params: GridValueGetterParams) => params.row.orderedItem.name,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    flex: 10,
    valueGetter: (params: GridValueGetterParams) => params.row.quantity,
  },
  {
    field: "note",
    headerName: "Note",
    flex: 50,
    valueGetter: (params: GridValueGetterParams) => params.row.note,
  },
];

type OrderFormProps = {
  products: ProductType[];
  order?: OrderType;
};

export default function OrderForm({ products, order }: OrderFormProps) {
  // Hooks
  const navigate = useNavigate();
  const actionData = useActionData<OrderActionData>();
  const transition = useTransition();

  // State
  const [open, setOpen] = React.useState(false);
  const [orderItems, setOrderItems] = React.useState<OrderItemType[]>(
    order?.orderedItems ?? []
  );
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [selectedProductQuantity, setSelectedProductQuantity] =
    React.useState<string>("");
  const [note, setNote] = React.useState<string>("");
  // const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>(
  //   []
  // );
  const [isEditOrderItem, setIsEditOrderItem] = React.useState<boolean>(false);

  // Helper functions
  const clearModalFields = () => {
    setSelectedProductId("");
    setSelectedProductQuantity("");
  };
  const handleOpen = () => {
    clearModalFields();
    setOpen(true);
  };
  const handleClose = () => {
    clearModalFields();
    setIsEditOrderItem(false);
    setOpen(false);
  };
  const handleSelectProduct = (event: SelectChangeEvent) => {
    setSelectedProductId(event.target.value);
  };

  const handleAddOrderItem = () => {
    const orderedItem = products.find(
      (product) => product._id === selectedProductId
    );

    const newOrderItem = {
      orderedItem: {
        _id: `${orderedItem?._id}.${Date.now()}`,
        name: orderedItem?.name,
      },
      quantity: Number(selectedProductQuantity),
      note,
    } as OrderItemType;

    // if (
    //   orderItems.some(
    //     (item) => item.orderedItem._id === newOrderItem.orderedItem._id
    //   )
    // ) {
    //   const existingItemIndex = orderItems.findIndex(
    //     (item) => item.orderedItem._id === newOrderItem.orderedItem._id
    //   );
    //   const existingItem = orderItems[existingItemIndex];

    //   setOrderItems([
    //     ...orderItems.slice(0, existingItemIndex),
    //     {
    //       ...orderItems[existingItemIndex],
    //       quantity: isEditOrderItem
    //         ? newOrderItem.quantity
    //         : existingItem.quantity + newOrderItem.quantity,
    //     },
    //     ...orderItems.slice(existingItemIndex + 1),
    //   ]);
    // } else {
    //   setOrderItems([...orderItems, newOrderItem]);
    // }
    setOrderItems([...orderItems, newOrderItem]);

    handleClose();
  };

  // const handleDeleteOrderItems = () => {
  //   let updatedOrderItems: OrderItemType[] = [];
  //   orderItems.forEach((item) => {
  //     if (!selectedProductIds.includes(item.orderedItem._id!)) {
  //       updatedOrderItems.push(item);
  //     }
  //   });

  //   setOrderItems(updatedOrderItems);
  // };

  // const handleEditOrderItem = () => {
  //   setIsEditOrderItem(true);
  //   const orderItem = orderItems.find(
  //     (item) => item.orderedItem._id === selectedProductIds[0]
  //   );
  //   if (orderItem) {
  //     setSelectedProductId(selectedProductIds[0]);
  //     setSelectedProductQuantity(orderItem.quantity.toString());
  //     setOpen(true);
  //   }
  // };

  return (
    <Form method="post">
      <div className="flex flex-col max-w-4xl mx-auto p-4">
        <div className="w-full flex justify-between mb-2">
          <Button type="button" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <div>
            {transition.state === "idle" && (
              <Button variant="contained" type="submit">
                {order ? "Update" : "Add"}
              </Button>
            )}
            {transition.state === "submitting" && (
              <Button
                variant="contained"
                type="submit"
                disabled={transition.state === "submitting"}
              >
                {order ? "Updating..." : "Adding..."}
              </Button>
            )}
            {order && (
              <Button
                className="ml-2"
                variant="contained"
                color="error"
                type="submit"
                name="delete"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
        <TextField
          id="order-number"
          label="Order Number"
          name="orderNumber"
          type="number"
          sx={{ py: 1, width: "100%" }}
          defaultValue={order?.orderNumber}
          aria-invalid={
            Boolean(actionData?.fieldErrors?.orderNumber) || undefined
          }
          aria-describedby={
            actionData?.fieldErrors?.orderNumber
              ? "order-number-error"
              : undefined
          }
        />
        {actionData?.fieldErrors?.orderNumber ? (
          <p className="text-red-600" role="alert" id="order-number-error">
            {actionData.fieldErrors.orderNumber}
          </p>
        ) : null}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="Add-order-item-modal"
          aria-describedby="A-modal-that-allows-you-to-add-order-items"
        >
          <Box sx={modalStyle({ width: "auto" })}>
            <Typography id="Add-order-item-modal" variant="h6" component="h2">
              Order Item
            </Typography>
            <Typography
              id="A-modal-that-allows-you-to-add-order-items"
              sx={{ my: 2 }}
            >
              Select a product from the list and set the quantity you want to
              add to this order
            </Typography>
            <FormControl sx={{ py: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-helper-label">
                Product
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectedProductId}
                label="Product"
                onChange={handleSelectProduct}
                disabled={isEditOrderItem}
              >
                {products.map((product, i) => (
                  <MenuItem value={product._id} key={product._id}>
                    <em>{product.name}</em>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="outlined-number"
              label="Quantity"
              type="number"
              value={selectedProductQuantity}
              onChange={(event) =>
                setSelectedProductQuantity(String(event.target.value))
              }
              sx={{ py: 1, width: "100%" }}
            />
            <TextField
              id="note"
              label="Note"
              type="text"
              multiline
              rows={4}
              placeholder="(Optional)"
              value={note}
              onChange={(event) => setNote(String(event.target.value))}
              sx={{ py: 1, width: "100%" }}
            />
            <div style={modalButtonStyle}>
              <Button sx={{ mr: 2 }} variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddOrderItem}
                disabled={
                  !selectedProductId ||
                  !selectedProductQuantity ||
                  selectedProductQuantity === "0"
                }
              >
                {isEditOrderItem ? "Update" : "Add"}
              </Button>
            </div>
          </Box>
        </Modal>

        <div className="flex justify-between items-center w-full">
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold">Item List:</div>

            <Button className="my-6" variant="contained" onClick={handleOpen}>
              + Add Item
            </Button>

            {/* {selectedProductIds.length > 0 && (
              <div className="flex item-center">
                <Button
                  className="my-6 mr-2"
                  color="error"
                  variant="contained"
                  onClick={handleDeleteOrderItems}
                >
                  Delete
                </Button>

                {selectedProductIds.length === 1 && (
                  <Button
                    className="my-6"
                    variant="contained"
                    onClick={handleEditOrderItem}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )} */}
          </div>
        </div>
        <Divider />

        <div style={{ height: 400, width: "100%" }}>
          {actionData?.formError ? (
            <p className="text-red-600 mb-1" role="alert" id="item-error">
              {actionData.formError}
            </p>
          ) : null}
          <DataGrid
            rows={orderItems}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15]}
            getRowId={(row) => row.orderedItem._id}

            // checkboxSelection
            // onSelectionModelChange={(
            //   selectionModel: GridSelectionModel,
            //   details: GridCallbackDetails
            // ) => {
            //   setSelectedProductIds(selectionModel as string[]);
            // }}
          />
        </div>

        <label htmlFor="orderDate" className="text-xl font-bold mt-8">
          Order Date:
        </label>
        <TextField
          type="date"
          id="orderDate"
          name="orderDate"
          className="border-2"
          defaultValue={order ? order.date : ""}
          aria-invalid={
            Boolean(actionData?.fieldErrors?.orderDate) || undefined
          }
          aria-describedby={
            actionData?.fieldErrors?.orderDate ? "order-date-error" : undefined
          }
        />
        {actionData?.fieldErrors?.orderDate ? (
          <p className="text-red-600" role="alert" id="order-date-error">
            {actionData.fieldErrors.orderDate}
          </p>
        ) : null}

        <input type="hidden" name="orderId" value={order?._id} />
      </div>
    </Form>
  );
}
