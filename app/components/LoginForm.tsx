import { Button, TextField } from "@mui/material";

export default function LoginForm() {
  return (
    <form method="post">
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
          {/* <Link to="/signup"> */}
          <Button name="signup" type="button" className="text-blue-600">
            Sign up
          </Button>
          {/* </Link> */}
        </div>
      </div>
    </form>
  );
}
