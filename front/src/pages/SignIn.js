import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [activate, setActivate] = useState(0);
  const [logged, setLogged] = useState(false);

  function postLogin() {
    fetch(`${API_ENDPOINT}/auth/login`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.uuid !== undefined) {
          setLogged(true);
        } else setIsError(true);
      })
      .catch(e => {
        setIsError(true);
      });
  }

  if (logged) {
    return <Redirect to="/" />;
  }

  if (
    props.match.params.uuid !== undefined &&
    props.match.params.token !== undefined &&
    activate === 0
  ) {
    // API
    fetch(
      `${API_ENDPOINT}/user/registration/activate/${props.match.params.uuid}/${props.match.params.token}`,
      {
        credentials: "include",
        method: "GET"
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") setActivate(2);
        else setActivate(1);
      });
  }
  return (
    <Container component="main" maxWidth="xs">
      <Snackbar open={activate === 1} autoHideDuration={6000}>
        <Alert severity="error">
          Url incorect, please check the link of your validation email
        </Alert>
      </Snackbar>
      <Snackbar open={activate === 2} autoHideDuration={6000}>
        <Alert severity="success">
          Your Account has been successfully activate ! <br />
          You Can Login Now !
        </Alert>
      </Snackbar>
      <Snackbar open={isError} autoHideDuration={6000}>
        <Alert severity="error">Username or Password incorect !</Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            error={isError}
            onChange={e => {
              setUserName(e.target.value);
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            error={isError}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={postLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/password-reset" variant="body2">
                Forgot password?
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
      <Oauth />
      <Box mt={8}>
        <Footer />
      </Box>
    </Container>
  );
}
