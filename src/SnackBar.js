import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

export default function SnackBar({ data }) {
  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState(undefined);

  React.useEffect(() => {
    if (data !== "") {
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={transition}
        message={data}
        key={transition ? transition.name : ""}
      />
    </div>
  );
}
