import { ActionFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Form, useActionData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import ResponsiveAppBar from "~/components/AppBar";
import { supabase } from "~/services/supabase";
import { Button, TextInput } from "@mantine/core";

export let action: ActionFunction = async ({ request }) => {
  let form = await request.formData();
  let signupEmail = form.get("email") as string;
  let signupPassword = form.get("password") as string;

  const response = new Response();

  await supabase.auth.signOut();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_PROJ_URL!,
    process.env.SUPABASE_PUBLIC_KEY!,
    { request, response }
  );

  // sign up the user
  const { data, error } = await supabaseClient.auth.signUp({
    email: String(signupEmail),
    password: String(signupPassword),
  });
  if (!error) {
    // all good, set session and move on
    // let session = await getSession(request.headers.get("Cookie"));
    // session.set("access_token", sessionData?.access_token);
    return redirect("/", {
      headers: response.headers,
    });
  }

  // else return the error
  return json(
    {
      user: data?.user,
      error,
    },
    { headers: response.headers }
  );
};

export default function Signup(): JSX.Element {
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
            <TextInput
              id="email"
              label="Email"
              name="email"
              type="text"
              sx={{ py: 1, width: "50%" }}
            />
            <TextInput
              id="password"
              label="Password"
              name="password"
              type="password"
              sx={{ py: 1, width: "50%" }}
            />
            <div className="flex flex-col items-center w-1/2">
              <Button name="signup" type="submit" className="w-full">
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
