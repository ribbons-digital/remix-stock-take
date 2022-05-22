import type { SanityDocumentStub } from "@sanity/client";
import type { ItemType } from "~/types";

import { sanity } from "../utils/sanity-client";

export const getItems = async () => {
  const query =
    '*[_type == "item"]{ _id, name, quantity, "inProduct": *[_type=="product" && references(^._id)]{ _id, name } }';
  return await sanity.fetch(query);
};
