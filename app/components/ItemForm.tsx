import {
  Collapse,
  Box,
  Button,
  Modal,
  TextInput,
  Checkbox,
} from "@mantine/core";
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
  const [expanded, setExpanded] = React.useState(false);
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
        <Button variant="outline" type="button" onClick={() => navigate(-1)}>
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

      <div className="flex items-center justify-between w-full">
        <div className="text-xl font-bold mt-8 mb-4">In Product(s):</div>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Add New
        </Button>
      </div>
      <div className="mb-8">
        <>
          <label
            onClick={() => setExpanded((ex) => !ex)}
            htmlFor="select-existing-products"
            className="my-4 flex items-center cursor-pointer"
          >
            Select existing products{" "}
            {!expanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </label>
          <Collapse in={expanded}>
            {products.map((product) => {
              return (
                <Checkbox
                  name="product"
                  value={product._id}
                  defaultChecked={
                    item ? Boolean(inProducts?.includes(product._id)) : false
                  }
                  label={product.name}
                />
              );
            })}
          </Collapse>

          {actionData?.fieldErrors?.inProducts ? (
            <p className="text-red-600" role="alert" id="order-date-error">
              {actionData.fieldErrors.inProducts}
            </p>
          ) : null}
          <Modal
            opened={open}
            centered
            onClose={handleClose}
            aria-labelledby="Add-order-item-modal"
            aria-describedby="A-modal-that-allows-you-to-add-order-items"
          >
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
                      Boolean(actionData?.fieldErrors?.inProducts) || undefined
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
          </Modal>
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
