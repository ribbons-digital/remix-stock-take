import { Button, TextField } from "@mui/material";
import { Form } from "@remix-run/react";

type ItemFormProps = {
  item?: {
    name: string;
    quantity: number;
  };
};

export default function ItemForm({ item }: ItemFormProps) {
  return (
    <Form method="post" className="container mx-auto max-w-4xl">
      <TextField
        id="itemName"
        name="itemName"
        label="Item Name"
        type="text"
        defaultValue={item?.name}
        sx={{ py: 1, width: "100%" }}
      />
      <TextField
        id="quantity"
        name="quantity"
        label="Quantity"
        type="number"
        defaultValue={item?.quantity}
        sx={{ py: 1, width: "100%" }}
      />
      <Button className="mt-6 w-full" variant="contained" type="submit">
        {item ? "Update" : "Add"}
      </Button>
    </Form>
  );
}
