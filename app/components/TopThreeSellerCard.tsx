import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";

export default function TopThreeSellerCard() {
  return (
    <Card sx={{ minWidth: 300 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Top 3 Sellers
          </Typography>
        }
      />
      <CardContent>
        <div className="flex items-center w-full justify-between">
          <Typography variant="caption" component="div">
            Omnia Oven
          </Typography>

          <Typography variant="caption" component="div">
            20
          </Typography>
        </div>
        <div className="flex items-center w-full justify-between">
          <Typography variant="caption" component="div">
            MoonShade
          </Typography>

          <Typography variant="caption" component="div">
            15
          </Typography>
        </div>
        <div className="flex items-center w-full justify-between">
          <Typography variant="caption" component="div">
            Haven XL - Forest Camo
          </Typography>

          <Typography variant="caption" component="div">
            12
          </Typography>
        </div>
        <Typography sx={{ mb: 2 }} color="text.secondary">
          This month
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
