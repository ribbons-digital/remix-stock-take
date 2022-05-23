import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getProducts } from "~/api/product";
import ProductItemForm from "~/components/ProductItemForm";
import type { ProductType } from "~/types";

export const loader: LoaderFunction = async () => {
  const products = await getProducts();

  return products;
};

export default function ProductItem() {
  const products = useLoaderData<ProductType[]>();
  console.log(products);

  return products.map((product) => {
    return <ProductItemForm product={product} key={product._id} />;
  });
}
