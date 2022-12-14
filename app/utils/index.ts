import { json, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { createProduct } from "~/api/product";
import type { ItemActionData } from "~/routes/items/new";
import { destroySession, getSession } from "~/services/session.server";
import type { AuthType } from "~/types";

export function validatefieldContent(content: string) {
  if (!content) {
    return `The field can't be empty`;
  }
}

export function validateCheckBoxes(value: string[]) {
  if (!value || value.length === 0) {
    return `Please select one or more products`;
  }
}

export const modalStyle = ({ width }: { width: number | string }) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: "24",
  p: "4",
  height: "auto",
  overflow: "scroll",
});

export function groupBy<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K | { (obj: T): string }
): Record<string, T[]> {
  const keyFn = key instanceof Function ? key : (obj: T) => obj[key];
  return array.reduce((objectsByKeyValue, obj) => {
    const value = keyFn(obj);
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {} as Record<string, T[]>);
}

export async function isLoggedIn({
  request,
}: {
  request: Request;
}): Promise<AuthType> {
  const redirectTo = new URL(request.url).pathname;
  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_PROJ_URL!,
    process.env.SUPABASE_PUBLIC_KEY!,
    { request, response }
  );

  //  let session = await getSession(request.headers.get("Cookie"));
  const { data, error } = await supabaseClient.auth.getSession();

  if (!data.session?.user) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  } else {
    if (!error) {
      // return data and any potential errors along with user
      return {
        user: data.session.user,
      };
    } else {
      return { error };
    }
  }
}

export async function signOut({ request }: { request: Request }) {
  // get session
  let session = await getSession(request.headers.get("Cookie"));

  // destroy session and redirect to login page
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

const badRequest = (data: ItemActionData) => {
  return json(data, { status: 400 });
};

export const addProduct = async (newProduct: string, redirectURL: string) => {
  const fieldErrors = {
    productName: validatefieldContent(newProduct),
  };

  const fields = { productName: newProduct };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  await createProduct({ name: newProduct });
  return redirect(redirectURL);
};
