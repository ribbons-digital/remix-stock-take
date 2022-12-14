import { Box, Button, Modal, TextInput, Checkbox } from "@mantine/core";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import React from "react";
import type { ItemActionData } from "~/routes/items/new";
import { modalStyle } from "~/utils";

type ItemFormProps = {
  item?: {
    name: string;
    quantity: number;
    cost: number;
  };
  inProducts?: string[];
  products: {
    _id: string;
    name: string;
  }[];
};

export default function ItemForm({
  item,
  inProducts,
  products,
}: ItemFormProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const actionData = useActionData<ItemActionData>();
  const transition = useTransition();
  const action = transition.submission?.formData.get("action");
  const isAddingProduct =
    transition.state === "submitting" && action === "add-product";
  const isCreatingItem =
    transition.state === "submitting" && action === "create-item";

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (!isAddingProduct) {
      setOpen(false);
    }
  }, [isAddingProduct]);

  return (
    <Form method="post" className="container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-between mb-2">
        <Button type="button" onClick={() => navigate(-1)}>
          Go back
        </Button>
        {!isCreatingItem && (
          <Button
            type="submit"
            name="action"
            value={item ? "update-item" : "create-item"}
          >
            {item ? "Update" : "Create"}
          </Button>
        )}
        {isCreatingItem && (
          <Button type="submit" disabled={isCreatingItem}>
            {item ? "Updating..." : "Creating..."}
          </Button>
        )}
      </div>
      <TextInput
        id="itemName"
        name="itemName"
        label="Item Name"
        type="text"
        defaultValue={item?.name}
        sx={{ py: 1, width: "100%" }}
        aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.name ? "name-error" : undefined
        }
      />
      {actionData?.fieldErrors?.name ? (
        <p className="text-red-600" role="alert" id="name-error">
          {actionData.fieldErrors.name}
        </p>
      ) : null}
      <TextInput
        id="quantity"
        name="quantity"
        label="Quantity"
        type="number"
        className={item ? "mt-4" : "mt-1"}
        defaultValue={item?.quantity}
        sx={{ py: 1, width: "100%" }}
        aria-invalid={Boolean(actionData?.fieldErrors?.quantity) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.quantity ? "quantity-error" : undefined
        }
      />
      {actionData?.fieldErrors?.quantity ? (
        <p className="text-red-600" role="alert" id="quantity-error">
          {actionData.fieldErrors.quantity}
        </p>
      ) : null}

      <div className="text-xl font-bold mt-8 mb-4">In Product:</div>
      <div className="mb-8">
        <>
          <label htmlFor="select-existing-products" className="my-2">
            Select existing products:
          </label>
          {products.map((product) => {
            return (
              <Checkbox
                name="product"
                value={product._id}
                defaultChecked={
                  item ? Boolean(inProducts?.includes(product._id)) : false
                }
                // checked={Boolean(inProducts?.includes(product._id))}
              />
            );
          })}

          {actionData?.fieldErrors?.inProducts ? (
            <p className="text-red-600" role="alert" id="order-date-error">
              {actionData.fieldErrors.inProducts}
            </p>
          ) : null}
          <Modal
            opened={open}
            onClose={handleClose}
            aria-labelledby="Add-order-item-modal"
            aria-describedby="A-modal-that-allows-you-to-add-order-items"
          >
            <Box sx={modalStyle({ width: "400px" })}>
              <form>
                <div>
                  <div>
                    <TextInput
                      id="add-new-product"
                      name="add-new-product"
                      label="Add a new product"
                      type="text"
                      className={item ? "mt-4" : "mt-1"}
                      sx={{ py: 1, width: "100%" }}
                      aria-invalid={
                        Boolean(actionData?.fieldErrors?.inProducts) ||
                        undefined
                      }
                      aria-describedby={
                        actionData?.fieldErrors?.inProducts
                          ? "inProducts-error"
                          : undefined
                      }
                    />
                    {actionData?.fieldErrors?.productName ? (
                      <p style={{ color: "red" }} role="alert">
                        {actionData?.fieldErrors.productName}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    name="action"
                    value="add-product"
                    disabled={isAddingProduct}
                    style={{ width: "100%", marginTop: "2rem" }}
                  >
                    {isAddingProduct ? "Adding..." : "Add"}
                  </Button>
                </div>
              </form>
            </Box>
          </Modal>
          <Button type="button" onClick={() => setOpen(true)}>
            Add New
          </Button>
        </>
      </div>
      <TextInput
        id="cost"
        name="cost"
        label="Cost Per Item"
        type="number"
        className={item ? "mt-4" : "mt-1"}
        defaultValue={item?.cost}
        sx={{ py: 1, width: "100%" }}
        aria-invalid={Boolean(actionData?.fieldErrors?.cost) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.cost ? "cost-error" : undefined
        }
      />
      {actionData?.fieldErrors?.cost ? (
        <p className="text-red-600" role="alert" id="cost-error">
          {actionData.fieldErrors.cost}
        </p>
      ) : null}
    </Form>
  );
}
