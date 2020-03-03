import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { API_ENDPOINT } from "../constant";
import Footer from "../components/Footer";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function ResetPassword() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function postEmail() {
    fetch(`${API_ENDPOINT}/user/reset`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") {
          setSuccess(true);
        } else if (res.errors) {
          setError(res.errors[0].msg);
        } else {
          setError("Verify your Infromation");
        }
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar open={error === "" ? false : true} autoHideDuration={1}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000}>
        <Alert severity="success">
          We sent you a reset email <br /> Check your email box for continue !
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Your Password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={postEmail}
          >
            Reset
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/sign-in" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Footer />
      </Box>
    </Container>
  );
}
