import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Form, Link } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";

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
    <AppBar position="sticky" className="mb-4">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {user && (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => {
                if (page === "Log out") {
                  return (
                    <Link to="/logout">
                      <Button
                        type="button"
                        name="logout"
                        style={{ width: "100%" }}
                      >
                        {page}
                      </Button>
                    </Link>
                  );
                } else {
                  return (
                    <Link key={page} to={`/${page.toLowerCase()}`}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                    </Link>
                  );
                }
              })}
            </Menu>
          </Box>

          <Link to="/">
            <img src={`/img/logo.png`} alt="logo" width="80px" />
          </Link>

          {user && (
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 6 }}
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
            <Box sx={{ flexGrow: 0 }}>
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
