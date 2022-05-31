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
    cost?: string | undefined;
  };
  fields?: {
    name: string;
    quantity: string;
    cost?: string;
  };
};

const badRequest = (data: ItemActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("itemName") as string;
  const quantity = form.get("quantity") as string;
  const cost = form.get("cost") as string;

  const fieldErrors = {
    name: validatefieldContent(name),
    quantity: validatefieldContent(quantity),
    cost: validatefieldContent(cost),
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
    cost: cost ? Number(cost) : 0,
  });

  return redirect("/items");
};

export default function NewItem() {
  return <ItemForm />;
}
