import { Box, Modal } from "@mui/material";
import { useNavigate, useParams } from "@remix-run/react";
import { modalStyle } from "~/utils";

export default function ProductOrders() {
  const params = useParams();
  const navigate = useNavigate();
  console.log(params);
  return (
    <Modal
      open={Boolean(params.product)}
      onClose={() => navigate(-1)}
      aria-labelledby="Add-order-item-modal"
      aria-describedby="A-modal-that-allows-you-to-add-order-items"
    >
      <Box sx={modalStyle({ width: 800 })}>Order Modal</Box>
    </Modal>
  );
}
