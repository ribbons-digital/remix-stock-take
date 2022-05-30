import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItems } from "~/api/item";
import {
  addItemInProduct,
  deleteItemInProduct,
  getProduct,
  updateProduct,
} from "~/api/product";
import ProductForm from "~/components/ProductForm";

import type { ItemType, ProductType } from "~/types";
import { validatefieldContent } from "~/utils";
import type { ProductActionData } from "./new";

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.product!;
  const products = await getProduct({ id });

  const items = await getItems();

  const filteredItems =
    products[0].items && products[0].items.length > 0
      ? items.filter(
          (item: ItemType) =>
            !products[0].items.some((pItem: ItemType) => pItem._id === item._id)
        )
      : items;

  return json({
    product: products[0],
    items: filteredItems,
  });
};

const badRequest = (data: ProductActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const name = form.get("productName") as string;

  const deleteItem = form.get("deleteItem") as string;
  const addItem = form.get("addItem") as string;

  const fieldErrors = {
    name: validatefieldContent(name),
  };

  const fields = { name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }
  if (deleteItem) {
    const { itemId, items, productId } = JSON.parse(deleteItem);
    // const newItemList = items.filter(
    //   (item: ItemType) => item._id !== itemId
    // );
    const index = items.findIndex((item: ItemType) => item._id === itemId);

    await deleteItemInProduct({ id: productId, index });

    return redirect(`/products/${productId}`);
  } else if (addItem) {
    const itemId = addItem;
    const itemRef = [
      {
        _type: "reference",
        _ref: itemId,
      },
    ];
    await addItemInProduct({ id: params.product!, itemRef });
    return redirect(`/products/${params.product}`);
  } else {
    const id = form.get("submit") as string;
    const name = form.get("productName") as string;

    await updateProduct({ id, name });

    return redirect("/products");
  }
};

type LoaderData = {
  product: ProductType;
  items: ItemType[];
};

export default function ProductItem() {
  const { product, items } = useLoaderData<LoaderData>();

  return <ProductForm product={product} items={items} />;
}
