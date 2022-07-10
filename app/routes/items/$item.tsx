import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItem, updateItem } from "~/api/item";
import { addItemInProduct, getProducts } from "~/api/product";
import ItemForm from "~/components/ItemForm";
import type { ItemType, ProductType } from "~/types";
import { addProduct, validateCheckBoxes, validatefieldContent } from "~/utils";
import type { ItemActionData } from "./new";

const badRequest = (data: ItemActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const action = form.get("action") as string;
  switch (action) {
    case "update-item": {
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

      await updateItem({
        id: params.item as string,
        name,
        quantity: Number(quantity),
        cost: cost ? Number(cost) : 0,
      });

      await Promise.all(
        selectedProducts.map(async (productId) => {
          await addItemInProduct({
            id: productId,
            itemRef: [
              {
                _type: "reference",
                _ref: params.item as string,
              },
            ],
          });
        })
      );

      return redirect("/items");
    }
    case "add-product": {
      const newProduct = form.get("add-new-product") as string;
      return addProduct(newProduct, `/items/${params.item}`);
    }
    default: {
      throw new Error("Unknow action");
    }
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const item = (await getItem(params.item!)) as ItemType[];
  const productsDetails = (await getProducts()) as ProductType[];
  const products = productsDetails.map((product) => ({
    _id: product._id,
    name: product.name,
  }));
  const inProducts = item[0].inProduct.map(
    (product) => product._id
  ) as string[];

  return {
    ...item[0],
    inProducts,
    products,
  };
};

type LoaderData = {
  name: string;
  quantity: number;
  cost: number;
  inProducts: string[];
  products: {
    _id: string;
    name: string;
  }[];
};

export default function Item() {
  const { name, quantity, cost, inProducts, products } =
    useLoaderData<LoaderData>();
  const item = {
    name,
    quantity,
    cost,
  };

  return <ItemForm item={item} inProducts={inProducts} products={products} />;
}
