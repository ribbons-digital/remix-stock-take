export function validatefieldContent(content: string) {
  if (!content) {
    return `The field can't be empty`;
  }
}

export const modalStyle = ({ width }: { width: number }) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
});
