import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItems } from "~/api/item";
import { createProduct } from "~/api/product";
import ProductForm from "~/components/ProductForm";
import type { ItemType } from "~/types";
import { validatefieldContent } from "~/utils";

export type ProductActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
  };
  fields?: {
    name: string;
  };
};

const badRequest = (data: ProductActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("productName") as string;
  // const quantity = form.get("quantity") as string;

  const fieldErrors = {
    name: validatefieldContent(name),
    // quantity: validatefieldContent(quantity),
  };

  const fields = { name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  const product = await createProduct({
    name,
  });
  return redirect(`/products/${product._id}`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const items = await getItems();
  return items;
};

export default function NewProduct() {
  const items = useLoaderData<ItemType[]>();

  return <ProductForm items={items} />;
}
