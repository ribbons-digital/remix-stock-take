import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoginForm from "~/components/LoginForm";
// import Login from "~/routes/login";

describe("LoginForm", () => {
  test("The Login Page should load correctly", async () => {
    const { container } = render(<LoginForm />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <form
          method="post"
        >
          <div
            class="flex flex-1 items-center flex-col"
          >
            <div
              class="MuiFormControl-root MuiTextField-root css-f8s2fi-MuiFormControl-root-MuiTextField-root"
            >
              <label
                class="MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-root MuiFormLabel-colorPrimary css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root"
                data-shrink="false"
                for="email"
                id="email-label"
              >
                Email
              </label>
              <div
                class="MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-formControl css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root"
              >
                <input
                  aria-invalid="false"
                  class="MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
                  defaultvalue=""
                  id="email"
                  name="email"
                  type="text"
                />
                <fieldset
                  aria-hidden="true"
                  class="MuiOutlinedInput-notchedOutline css-1d3z3hw-MuiOutlinedInput-notchedOutline"
                >
                  <legend
                    class="css-1ftyaf0"
                  >
                    <span>
                      Email
                    </span>
                  </legend>
                </fieldset>
              </div>
            </div>
            <div
              class="MuiFormControl-root MuiTextField-root css-f8s2fi-MuiFormControl-root-MuiTextField-root"
            >
              <label
                class="MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-root MuiFormLabel-colorPrimary css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root"
                data-shrink="false"
                for="password"
                id="password-label"
              >
                Password
              </label>
              <div
                class="MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-formControl css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root"
              >
                <input
                  aria-invalid="false"
                  class="MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
                  defaultvalue=""
                  id="password"
                  name="password"
                  type="password"
                />
                <fieldset
                  aria-hidden="true"
                  class="MuiOutlinedInput-notchedOutline css-1d3z3hw-MuiOutlinedInput-notchedOutline"
                >
                  <legend
                    class="css-1ftyaf0"
                  >
                    <span>
                      Password
                    </span>
                  </legend>
                </fieldset>
              </div>
            </div>
            <div
              class="flex flex-col items-center w-1/2"
            >
              <button
                class="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root w-full css-sghohy-MuiButtonBase-root-MuiButton-root"
                name="login"
                tabindex="0"
                type="submit"
              >
                Log in
                <span
                  class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"
                />
              </button>
              <div
                class="text-blue-600 mt-4"
              >
                Don't have an account?
              </div>
              <button
                class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root text-blue-600 css-1e6y48t-MuiButtonBase-root-MuiButton-root"
                name="signup"
                tabindex="0"
                type="button"
              >
                Sign up
                <span
                  class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    `);
    // expect(true).toBe(true);
  });
});
