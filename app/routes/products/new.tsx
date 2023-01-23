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
    shopifyId: string | undefined;
    shopifyVariantId: string | undefined;
  };
  fields?: {
    name: string;
    isKit: boolean;
    price: string;
    shopifyId: string;
    shopifyVariantId: string;
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
  const shopifyId = form.get("shopifyId") as string;
  const shopifyVariantId = form.get("shopifyVariantId") as string;
  const fieldErrors = {
    name: validatefieldContent(name),
    price: validatefieldContent(price),
    shopifyId: validatefieldContent(shopifyId),
    shopifyVariantId: validatefieldContent(shopifyVariantId),
  };

  const fields = { name, isKit, price, shopifyId, shopifyVariantId };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  const product = await createProduct({
    name,
    isKit,
    shopifyId,
    shopifyVariantId,
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
