import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import CardMedia from "@material-ui/core/CardMedia";
import { API_ENDPOINT } from "../constant";

export default function Oauth() {
  return (
    <Box mt={8}>
      <Grid container justify="center" spacing={3}>
        <Grid item>
          <Link href={`${API_ENDPOINT}/auth/42`}>
            <CardMedia
              component="img"
              alt="Logiin With 42"
              height="69"
              image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"
              title="Login with 42"
            />
          </Link>
        </Grid>
        <Grid item>
          <Link href={`${API_ENDPOINT}/auth/google`}>
            <CardMedia
              component="img"
              alt="Login with Google"
              height="69"
              image="https://www.usine-digitale.fr/mediatheque/5/0/0/000305005_homePageUne/logo-google-g.jpg"
              title="Login with Google"
            />
          </Link>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Box>
  );
}
