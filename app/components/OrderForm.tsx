import {
  Table,
  Button,
  Divider,
  TextInput,
  Menu,
  Select,
  Box,
  Modal,
  Text,
  Textarea,
} from "@mantine/core";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import React from "react";
import type { OrderActionData } from "~/routes/orders/new";
import type { OrderItemType, OrderType, ProductType } from "~/types";
import { modalStyle } from "~/utils";

const modalButtonStyle = {
  display: "flex",
  justifyContent: "end",
};

// const columns: GridColDef[] = [
//   // {
//   //   field: "id",
//   //   headerName: "ID",
//   //   width: 400,
//   //   valueGetter: (params: GridValueGetterParams) => params.row.orderedItem._id,
//   // },
//   {
//     field: "orderedItem",
//     headerName: "Product Name",
//     flex: 40,
//     valueGetter: (params: GridValueGetterParams) => params.row.orderedItem.name,
//   },
//   {
//     field: "quantity",
//     headerName: "Quantity",
//     flex: 10,
//     valueGetter: (params: GridValueGetterParams) => params.row.quantity,
//   },
//   {
//     field: "note",
//     headerName: "Note",
//     flex: 50,
//     valueGetter: (params: GridValueGetterParams) => params.row.note,
//   },
// ];

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
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <div>
            {order && (
              <Button
                className="mr-2"
                color="red"
                variant="outline"
                type="submit"
                name="delete"
              >
                Delete
              </Button>
            )}
            {transition.state === "idle" && (
              <Button type="submit">{order ? "Update" : "Add"}</Button>
            )}
            {transition.state === "submitting" && (
              <Button
                type="submit"
                variant="outline"
                disabled={transition.state === "submitting"}
              >
                {order ? "Updating..." : "Adding..."}
              </Button>
            )}
          </div>
        </div>
        <TextInput
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
          opened={open}
          onClose={handleClose}
          centered
          withinPortal={false}
          title="Add new item"
          aria-labelledby="Add-order-item-modal"
          aria-describedby="A-modal-that-allows-you-to-add-order-items"
        >
          <Text id="A-modal-that-allows-you-to-add-order-items" sx={{ mb: 3 }}>
            Select a product from the list and set the quantity you want to add
            to this order
          </Text>
          <form className="py-1 w-full">
            <Select
              id="demo-simple-select-helper"
              value={selectedProductId}
              label="Product"
              onChange={(value) => setSelectedProductId(value ?? "")}
              disabled={isEditOrderItem}
              data={products.map((product) => ({
                value: product._id!,
                label: product.name,
              }))}
            ></Select>
          </form>
          <TextInput
            id="outlined-number"
            label="Quantity"
            type="number"
            value={selectedProductQuantity}
            onChange={(event) =>
              setSelectedProductQuantity(String(event.target.value))
            }
            sx={{ py: 1, width: "100%" }}
          />
          <Textarea
            id="note"
            label="Note"
            autosize
            placeholder="(Optional)"
            value={note}
            onChange={(event) => setNote(String(event.target.value))}
            sx={{ py: 1, width: "100%" }}
          />
          <div className="flex justify-end mt-2">
            <Button
              className="mr-2"
              variant="outline"
              color="red"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOrderItem}
              variant="outline"
              disabled={
                !selectedProductId ||
                !selectedProductQuantity ||
                selectedProductQuantity === "0"
              }
            >
              {isEditOrderItem ? "Update" : "Add"}
            </Button>
          </div>
        </Modal>

        <div className="flex justify-between items-center w-full">
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold">Item List:</div>

            <Button className="my-6" variant="outline" onClick={handleOpen}>
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

        <div className="w-full h-auto mb-4">
          {actionData?.formError ? (
            <p className="text-red-600 mb-1" role="alert" id="item-error">
              {actionData.formError}
            </p>
          ) : null}
          <Table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.orderedItem.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <label htmlFor="orderDate" className="text-xl font-bold ">
          Order Date:
        </label>
        <TextInput
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
        <input
          type="hidden"
          name="orderedItems"
          value={JSON.stringify(orderItems)}
        />
      </div>
    </Form>
  );
}
