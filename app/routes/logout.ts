import type { LoaderFunction } from "@remix-run/node";
import { signOut } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  return await signOut({ request });
};
