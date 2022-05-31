import { Button, TextField } from "@mui/material";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import type { ItemActionData } from "~/routes/items/new";

type ItemFormProps = {
  item?: {
    name: string;
    quantity: number;
    cost: number;
  };
};

export default function ItemForm({ item }: ItemFormProps) {
  const navigate = useNavigate();
  const actionData = useActionData<ItemActionData>();
  const transition = useTransition();

  return (
    <Form method="post" className="container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-between mb-2">
        <Button type="button" onClick={() => navigate(-1)}>
          Go back
        </Button>
        {transition.state === "idle" && (
          <Button variant="contained" type="submit">
            {item ? "Update" : "Add"}
          </Button>
        )}
        {transition.state === "submitting" && (
          <Button
            variant="contained"
            type="submit"
            disabled={transition.state === "submitting"}
          >
            {item ? "Updating..." : "Adding..."}
          </Button>
        )}
      </div>
      <TextField
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
      <TextField
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
      <TextField
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
