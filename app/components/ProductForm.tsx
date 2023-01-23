import React from "react";
import { Button, Divider, Switch, TextInput } from "@mantine/core";
import {
  useActionData,
  useFetcher,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import type { ProductActionData } from "~/routes/products/new";
import type { ItemType, ProductType } from "~/types";
import ProductItemList from "./ProductItemList";

type ProductFormProps = {
  product?: ProductType;
  items: ItemType[];
};

export default function ProductForm({ product, items }: ProductFormProps) {
  const actionData = useActionData<ProductActionData>();
  const navigate = useNavigate();
  const transition = useTransition();
  const fetcher = useFetcher();
  const isSubmitting =
    (transition.state === "submitting" || transition.state === "loading") &&
    fetcher.submission?.formData.get("submit") === product?._id;

  return (
    <fetcher.Form method="post" className="container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-between mb-2">
        <Button variant="outline" type="button" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button
          name="submit"
          type="submit"
          value={product?._id}
          disabled={isSubmitting}
        >
          {product && !isSubmitting
            ? "Update"
            : !product && !isSubmitting
            ? "Add"
            : isSubmitting
            ? "processing..."
            : ""}
        </Button>
      </div>
      <TextInput
        id="productName"
        name="productName"
        label="Product Name"
        type="text"
        defaultValue={product ? product.name : actionData?.fields?.name}
        sx={{ py: 1, width: "100%" }}
        aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.name ? "name-error" : undefined
        }
      />
      {actionData?.fieldErrors?.name ? (
        <p className="text-red-600" role="alert" id="name-error">
          {actionData.fieldErrors.name}
        </p>
      ) : null}
      <TextInput
        id="shopifyId"
        name="shopifyId"
        label="Shopify ID"
        type="text"
        defaultValue={
          product ? product.shopifyId : actionData?.fields?.shopifyId
        }
        sx={{ py: 1, width: "100%" }}
        aria-invalid={Boolean(actionData?.fieldErrors?.shopifyId) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.shopifyId ? "shopifyId-error" : undefined
        }
      />
      {actionData?.fieldErrors?.shopifyId ? (
        <p className="text-red-600" role="alert" id="shopifyId-error">
          {actionData.fieldErrors.shopifyId}
        </p>
      ) : null}
      <TextInput
        id="shopifyVariantId"
        name="shopifyVariantId"
        label="Shopify Variant ID"
        type="text"
        defaultValue={
          product
            ? product.shopifyVariantId
            : actionData?.fields?.shopifyVariantId
        }
        sx={{ py: 1, width: "100%" }}
        aria-invalid={
          Boolean(actionData?.fieldErrors?.shopifyVariantId) || undefined
        }
        aria-describedby={
          actionData?.fieldErrors?.shopifyVariantId
            ? "shopifyId-error"
            : undefined
        }
      />
      {actionData?.fieldErrors?.shopifyVariantId ? (
        <p className="text-red-600" role="alert" id="shopifyVariantId-error">
          {actionData.fieldErrors.shopifyVariantId}
        </p>
      ) : null}
      <TextInput
        id="salePrice"
        name="salePrice"
        label="Sale Price"
        type="number"
        defaultValue={product ? product.price : actionData?.fields?.price}
        sx={{ py: 1, width: "100%" }}
        aria-invalid={Boolean(actionData?.fieldErrors?.price) || undefined}
        aria-describedby={
          actionData?.fieldErrors?.price ? "price-error" : undefined
        }
      />
      {actionData?.fieldErrors?.price ? (
        <p className="text-red-600" role="alert" id="price-error">
          {actionData.fieldErrors.price}
        </p>
      ) : null}
      <Switch
        name="isKit"
        onLabel="Yes"
        offLabel="No"
        className="mt-2"
        label="This is a kit. (check if this product contains more than one item)"
        defaultChecked={product ? product.isKit : actionData?.fields?.isKit}
      />

      {product ? (
        <div className="w-full mt-6">
          <label id="items" className="text-xl font-bold">
            Item(s):
          </label>
          <Divider className="my-2" />

          <ProductItemList
            currentProductItems={product?.items ?? []}
            allProductItems={items}
            fetcher={fetcher}
            product={product}
          />
        </div>
      ) : null}
    </fetcher.Form>
  );
}
