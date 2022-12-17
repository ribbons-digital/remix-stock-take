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
    price: string | undefined;
  };
  fields?: {
    name: string;
    isKit: boolean;
    price: string;
  };
};

const badRequest = (data: ProductActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("productName") as string;
  // const quantity = form.get("quantity") as string;

  const isKit = (form.get("isKit") as string) === "on" ? true : false;
  const price = form.get("salePrice") as string;
  const fieldErrors = {
    name: validatefieldContent(name),
    // quantity: validatefieldContent(quantity),
  };

  const fields = { name, price };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  const product = await createProduct({
    name,
    isKit,
    price: Number(price),
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
