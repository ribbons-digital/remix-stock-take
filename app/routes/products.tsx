import { Outlet } from "@remix-run/react";

export default function Products() {
  return (
    <>
      <h1>This is a list of products</h1>
      <Outlet />
    </>
  );
}
