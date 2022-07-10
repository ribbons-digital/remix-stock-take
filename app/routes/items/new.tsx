import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createItem } from "~/api/item";
import { addItemInProduct, getProducts } from "~/api/product";
import ItemForm from "~/components/ItemForm";
import type { ProductType } from "~/types";
import { addProduct, validateCheckBoxes, validatefieldContent } from "~/utils";

export type ItemActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string | undefined;
    quantity?: string | undefined;
    cost?: string | undefined;
    inProducts?: string | undefined;
    productName?: string | undefined;
  };
  fields?: {
    name?: string;
    quantity?: string;
    cost?: string;
    inProducts?: string[];
    productName?: string;
  };
};

const badRequest = (data: ItemActionData) => {
  return json(data, { status: 400 });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const productsDetails = (await getProducts()) as ProductType[];
  const products = productsDetails.map((product) => ({
    _id: product._id,
    name: product.name,
  }));

  return {
    products,
  };
};

type LoaderData = {
  products: {
    _id: string;
    name: string;
  }[];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action") as string;

  switch (action) {
    case "create-item": {
      const name = form.get("itemName") as string;
      const quantity = form.get("quantity") as string;
      const cost = form.get("cost") as string;
      const selectedProducts = form.getAll("product") as string[];

      const fieldErrors = {
        name: validatefieldContent(name),
        quantity: validatefieldContent(quantity),
        inProducts: validateCheckBoxes(selectedProducts),
      };

      const fields = { name, quantity };
      if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
          fieldErrors,
          fields,
        });
      }

      const item = await createItem({
        name,
        quantity,
        cost: cost ? Number(cost) : 0,
      });

      await Promise.all(
        selectedProducts.map(async (productId) => {
          await addItemInProduct({
            id: productId,
            itemRef: [
              {
                _type: "reference",
                _ref: item._id,
              },
            ],
          });
        })
      );

      return redirect("/items");
    }
    case "add-product": {
      const newProduct = form.get("add-new-product") as string;
      return addProduct(newProduct, "/items/new");
    }
    default: {
      throw new Error("Unknow action");
    }
  }
};

export default function NewItem() {
  const { products } = useLoaderData<LoaderData>();
  return <ItemForm products={products} />;
}
