import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";

export default function TotalInventoryValueCard() {
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
            Total Inventory Value
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="h5" component="div">
          $43,984
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          To date
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
