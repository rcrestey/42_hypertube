import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { FRONT_ENDPOINT } from "../constant";

export default function Footer() {
  return (
    <div>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href={`${FRONT_ENDPOINT}/`}>
          HYPERTUBE
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href={`${FRONT_ENDPOINT}/sign-in`} color="inherit">
          SIGN IN
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href={`${FRONT_ENDPOINT}/sign-up`} color="inherit">
          SIGN UP
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href={`${FRONT_ENDPOINT}/password-reset`} color="inherit">
          FORGOT PASSWORD
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href={`${FRONT_ENDPOINT}/`} color="inherit">
          HOME
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href={`${FRONT_ENDPOINT}/preferences`} color="inherit">
          PROFILE
        </Link>
      </Typography>
    </div>
  );
}
