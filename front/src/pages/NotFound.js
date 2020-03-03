import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { FRONT_ENDPOINT } from "../constant";

export default function NotFound() {
  return (
    <Box my="auto">
      <Typography align="center" variant="h2">
        error
      </Typography>
      <Typography align="center" variant="h1">
        404
      </Typography>
      <Box align="center">
        <Button
          variant="outlined"
          color="primary"
          href={FRONT_ENDPOINT}
          size="large"
        >
          GO BACK HOME
        </Button>
      </Box>
    </Box>
  );
}
