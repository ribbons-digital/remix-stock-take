import { Link, Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { supabase } from "~/services/supabase";
import { commitSession, getSession } from "~/services/session.server";
import { Button, TextField } from "@mui/material";
import ResponsiveAppBar from "~/components/AppBar";
import type { AuthType } from "~/types";
import { isLoggedIn } from "~/utils";

export let action: ActionFunction = async ({ request }) => {
  // get user credentials from form
  let form = await request.formData();
  let email = form.get("email") as string;
  let password = form.get("password") as string;

  // login using the credentials
  const {
    user,
    error,
    session: supaSession,
  } = await supabase.auth.signIn({
    email,
    password,
  });

  // if i have a user then create the cookie with the
  // auth_token, not sure if i want to use the auth token,
  // but it works... will do more research
  if (user) {
    // get session and set access_token
    let session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", supaSession?.access_token);

    // redirect to page with the cookie set in header
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // else return the error
  return { user, error };
};

// https://remix.run/guides/routing#index-routes
export default function Login() {
  const actionData = useActionData();

  return (
    <div>
      <ResponsiveAppBar user={null} />
      <main className="container mx-auto max-w-4xl p-4">
        <h2 className="font-bold text-2xl text-center mb-2">
          Nomad Nature Stock Take
        </h2>
        <Form method="post">
          <div className="flex flex-1 items-center flex-col">
            <TextField
              id="email"
              label="Email"
              name="email"
              type="text"
              sx={{ py: 1, width: "50%" }}
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              type="password"
              sx={{ py: 1, width: "50%" }}
            />
            <div className="flex flex-col items-center w-1/2">
              <Button
                variant="contained"
                name="login"
                type="submit"
                className="w-full"
              >
                Log in
              </Button>
              <div className="text-blue-600 mt-4">Don't have an account?</div>
              <Link to="/signup">
                <Button name="signup" type="button" className="text-blue-600">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </Form>
        <div>{actionData?.error ? actionData?.error?.message : null}</div>
      </main>
    </div>
  );
}
