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
import Oauth from "../components/Oauth";

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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: "none"
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [picture, setPicture] = useState();
  const [success, setSuccess] = useState(false);

  function postRegistration() {
    const formData = new FormData();

    formData.append("givenName", firstName);
    formData.append("familyName", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profile", picture);

    fetch(`${API_ENDPOINT}/user/registration`, {
      credentials: "include",
      method: "POST",
      body: formData
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
          We sent you a confirmation reset email <br /> Check your email box!
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                error={error === "" ? false : true}
                onChange={e => {
                  setFirstName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                error={error === "" ? false : true}
                onChange={e => {
                  setLastName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                error={error === "" ? false : true}
                onChange={e => {
                  setUsername(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                error={error === "" ? false : true}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                error={error === "" ? false : true}
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.root}>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  name="profile"
                  onChange={e => {
                    setPicture(e.target.files[0]);
                  }}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Upload Profile Picture
                  </Button>
                </label>
              </div>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={postRegistration}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Oauth />
      <Box mt={5}>
        <Footer />
      </Box>
    </Container>
  );
}
