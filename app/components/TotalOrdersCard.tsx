import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { format, subMonths } from "date-fns";
import React from "react";
import type { OrderType } from "~/types";

export default function TotalOrdersCard({ orders }: { orders: OrderType[] }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetcher = useFetcher();

  const fetchLastMonth = () => {
    fetcher.load(`/last_months_orders?startDate=2022-06-01&endDate=2022-06-30`);
    handleClose();
  };

  const fetchLastThreeMonth = () => {
    const currentDate = new Date();
    const now = format(currentDate, "yyyy-MM-dd");
    const previousMonth = format(subMonths(currentDate, 2), "MM");
    fetcher.load(
      `/last_months_orders?startDate=2022-${previousMonth}-01&endDate=${now}`
    );
    handleClose();
  };

  return (
    <Card sx={{ minWidth: 300 }}>
      <CardHeader
        action={
          <>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={fetchLastMonth}>Last month</MenuItem>
              <MenuItem onClick={fetchLastThreeMonth}>
                last three months
              </MenuItem>
            </Menu>
          </>
        }
        title={
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Total Orders
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {fetcher.data ? fetcher.data.orders.length : orders.length}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          This month
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
