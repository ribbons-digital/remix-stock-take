import { Link } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import * as React from "react";
import { Menu, Box, Container, Button } from "@mantine/core";

const pages = ["Products", "Orders", "Items", "Log out"];

type PropType = {
  user?: User | null;
};

const ResponsiveAppBar = ({ user }: PropType) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Container>
      <Box>
        {user && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button>User</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Options</Menu.Label>
              {pages.map((page) => {
                if (page === "Log out") {
                  return (
                    <Menu.Item key={page}>
                      <Link to="/logout">{page}</Link>
                    </Menu.Item>
                  );
                } else {
                  return (
                    <Menu.Item key={page}>
                      <Link to={`/${page.toLowerCase()}`}>{page}</Link>
                    </Menu.Item>
                  );
                }
              })}
            </Menu.Dropdown>
          </Menu>
        )}
      </Box>

      <Link to="/">
        <img src={`/img/logo.png`} alt="logo" width="80px" />
      </Link>

      {user && (
        <Box
          sx={(theme) => ({ flexGrow: 1, display: { xs: "flex", md: "none" } })}
        >
          {pages.map(
            (page) =>
              page !== "Log out" && (
                <Button
                  key={page}
                  onClick={() => {}}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  <Link to={`/${page.toLowerCase()}`}>{page}</Link>
                </Button>
              )
          )}
        </Box>
      )}
      {user && (
        <Box
          sx={(theme) => ({ flexGrow: 1, display: { xs: "flex", md: "none" } })}
        >
          <Link to="/logout">
            <Button
              type="button"
              name="logout"
              style={{ width: "100%" }}
              className="text-white"
            >
              Log out
            </Button>
          </Link>
        </Box>
      )}
    </Container>
  );
};
export default ResponsiveAppBar;
