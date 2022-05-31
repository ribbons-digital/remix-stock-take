import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItem, updateItem } from "~/api/item";
import ItemForm from "~/components/ItemForm";
import { validatefieldContent } from "~/utils";
import type { ItemActionData } from "./new";

const badRequest = (data: ItemActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request, params }) => {
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

  await updateItem({
    id: params.item!,
    name,
    quantity: Number(quantity),
    cost: cost ? Number(cost) : 0,
  });

  return redirect("/items");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const item = await getItem(params.item!);
  return item[0];
};

type LoaderData = {
  name: string;
  quantity: number;
  cost: number;
};

export default function NewItem() {
  const item = useLoaderData<LoaderData>();
  return <ItemForm item={item} />;
}
