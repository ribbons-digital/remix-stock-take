import { Button, Divider, TextField } from "@mui/material";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import type { ProductActionData } from "~/routes/products/new";
import type { ItemType, ProductType } from "~/types";
import ProductItemList from "./ProductItemList";

type ProductFormProps = {
  product?: ProductType;
  items: ItemType[];
};

export default function ProductForm({ product, items }: ProductFormProps) {
  const transition = useTransition();
  const actionData = useActionData<ProductActionData>();
  const navigate = useNavigate();

  return (
    <Form method="post" className="container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-between mb-2">
        <Button type="button" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button
          variant="contained"
          name="submit"
          type="submit"
          value={product?._id}
          disabled={transition.state === "submitting"}
        >
          {product &&
          (transition.state === "idle" || transition.state === "loading")
            ? "Update"
            : !product &&
              (transition.state === "idle" || transition.state === "loading")
            ? "Add"
            : transition.state === "submitting"
            ? "processing..."
            : ""}
        </Button>
      </div>
      <TextField
        id="productName"
        name="productName"
        label="Product Name"
        type="text"
        defaultValue={product ? product.name : actionData?.fields?.name}
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
      {/* <TextField
        id="quantity"
        name="quantity"
        label="Quantity"
        type="number"
        defaultValue={product ? product.quantity : actionData?.fields?.quantity}
        disabled={actionData?.fields?.name.toLowerCase().includes("kit")}
        aria-invalid={Boolean(actionData?.fieldErrors?.quantity) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.quantity ? "quantity-error" : undefined
        }
        sx={{ py: 1, width: "100%" }}
      />
      {actionData?.fieldErrors?.quantity ? (
        <p className="form-validation-error" role="alert" id="quantity-error">
          {actionData.fieldErrors.quantity}
        </p>
      ) : null} */}

      {product && (
        <div className="w-full mt-6">
          <label id="items" className="text-xl font-bold">
            Item(s):
          </label>
          <Divider className="my-2" />

          <ProductItemList
            currentProductItems={product?.items ?? []}
            allProductItems={items}
            productId={product?._id!}
          />
        </div>
      )}
    </Form>
  );
}
