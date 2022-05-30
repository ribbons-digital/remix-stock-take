import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItem, updateItem } from "~/api/item";
import ItemForm from "~/components/ItemForm";

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const name = form.get("itemName") as string;
  const quantity = Number(form.get("quantity") as string);

  await updateItem({
    id: params.item!,
    name,
    quantity,
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
};

export default function NewItem() {
  const item = useLoaderData<LoaderData>();
  return <ItemForm item={item} />;
}
