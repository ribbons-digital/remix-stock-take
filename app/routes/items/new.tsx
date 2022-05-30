import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createItem } from "~/api/item";
import ItemForm from "~/components/ItemForm";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("itemName") as string;
  const quantity = form.get("quantity") as string;

  await createItem({
    name,
    quantity,
  });

  return redirect("/items");
};

export default function NewItem() {
  return <ItemForm />;
}
