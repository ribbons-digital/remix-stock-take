import { Button, TextField } from "@mui/material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Form, useActionData, useLoaderData } from "@remix-run/react";
import ResponsiveAppBar from "~/components/AppBar";
import { commitSession, getSession } from "~/services/session.server";
import { supabase } from "~/services/supabase";
import type { AuthType } from "~/types";
import { isLoggedIn } from "~/utils";

export let action: ActionFunction = async ({ request }) => {
  let form = await request.formData();
  let email = form.get("email") as string;
  let password = form.get("password") as string;

  await supabase.auth.signOut();

  // sign up the user
  let {
    session: sessionData,
    user,
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (!signUpError) {
    // all good, set session and move on
    let session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", sessionData?.access_token);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // else return the error
  return { user, signUpError };
};

export default function Signup() {
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
                name="signup"
                type="submit"
                className="w-full"
              >
                Sign up
              </Button>
              <div className="text-blue-600 mt-4">Already have an account?</div>
              <Link to="/login">
                <Button name="login" type="button" className="text-blue-600">
                  Log in
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
