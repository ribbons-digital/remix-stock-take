import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createItem } from "~/api/item";
import ItemForm from "~/components/ItemForm";
import { validatefieldContent } from "~/utils";

export type ItemActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    quantity: string | undefined;
  };
  fields?: {
    name: string;
    quantity: string;
  };
};

const badRequest = (data: ItemActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("itemName") as string;
  const quantity = form.get("quantity") as string;

  const fieldErrors = {
    name: validatefieldContent(name),
    quantity: validatefieldContent(quantity),
  };

  const fields = { name, quantity };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  await createItem({
    name,
    quantity,
  });

  return redirect("/items");
};

export default function NewItem() {
  return <ItemForm />;
}
