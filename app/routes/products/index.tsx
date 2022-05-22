import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getProduct,
  getProducts,
  updateProductItemsQuantity,
  updateProductQuantity,
} from "~/api/product";
import ProductItemForm from "~/components/ProductItemForm";
import type { ProductType } from "~/types";
import productItemFormStyleUrl from "~/styles/components/productItemForm.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: productItemFormStyleUrl,
    },
  ];
};
export const loader: LoaderFunction = async () => {
  const products = await getProducts();

  return json(products);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const newQuantity = form.get("quantityInput");
  const productId = form.get("update") as string;
  const products = (await getProduct(productId)) as ProductType[];
  const originalQuantity = products[0].quantity;

  const updatedProduct = await updateProductQuantity({
    _id: productId,
    quantity: Number(newQuantity),
  });
  await updateProductItemsQuantity(
    productId,
    Number(newQuantity) - Number(originalQuantity)
  );

  return json(updatedProduct);
};

export default function ProductsIndex() {
  const products = useLoaderData<ProductType[]>();
  console.log(products);

  return (
    <div className="container mx-auto max-w-xl">
      <div className="columns-3 mb-2">
        <div className="text-xl font-bold text-center">Product</div>
        <div className="text-xl font-bold text-center">Quantity</div>
        <div className="text-xl font-bold text-center">Action</div>
      </div>

      {products.map((product) => {
        return <ProductItemForm product={product} key={product._id} />;
      })}
    </div>
  );
}
