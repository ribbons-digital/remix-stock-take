import React from "react";

import { Form } from "@remix-run/react";

import type { ProductType } from "~/types";

function ProductItemForm({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = React.useState(product.quantity);

  return (
    <Form method="post">
      <div className="columns-3">
        <div>{product.name}</div>
        <div>
          <label htmlFor="quantityInput" />
          <input
            className="border-2"
            id="quantityInput"
            name="quantityInput"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="w-full text-center">
          <button
            className="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center"
            type="submit"
            name="update"
            value={product._id}
          >
            Update
          </button>
        </div>
      </div>
    </Form>
  );
}
