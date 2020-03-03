import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { API_ENDPOINT } from "../constant";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { FRONT_ENDPOINT } from "../constant";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 4)
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

export default function UserEdition() {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [picture, setPicture] = useState();

  const [activate, setActivate] = useState(0);
  const [payload, setPayload] = useState("");

  const [alignment, setAlignment] = React.useState("FR");
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      fetch(`${API_ENDPOINT}/user/changing/preferedlg`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ preferedLg: newAlignment })
      })
        .then(res => res.json())
        .then(res => {
          if (res.status === "SUCCESS") {
            setActivate(2);
            setPayload("Prefered Language Successfully changed !");
          } else {
            setActivate(1);
            setPayload("Prefered Language: Invalid input");
          }
        });
    }
  };

  function getUser() {
    fetch(`${API_ENDPOINT}/user/me`, {
      credentials: "include",
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        setFirstName(res.givenName);
        setLastName(res.familyName);
        setUsername(res.username);
        setEmail(res.email);
        setPictureUrl(res.photo);
        setAlignment(res.preferedLg);
      });
  }

  if (email === "") getUser();

  function postFirstName() {
    fetch(`${API_ENDPOINT}/user/changing/givenname`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ givenName: firstName })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") {
          setActivate(2);
          setPayload("First Name Successfully changed !");
        } else {
          setActivate(1);
          setPayload("First Name: Invalid input");
        }
      });
  }

  function postLastName() {
    fetch(`${API_ENDPOINT}/user/changing/familyname`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ familyName: lastName })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") {
          setActivate(2);
          setPayload("Last Name Successfully changed !");
        } else {
          setActivate(1);
          setPayload("Last Name: Invalid input");
        }
      });
  }

  function postUsername() {
    fetch(`${API_ENDPOINT}/user/changing/username`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") {
          setActivate(2);
          setPayload("Username Successfully changed !");
        } else {
          setActivate(1);
          setPayload("Username: Invalid input");
        }
      });
  }

  function postEmail() {
    fetch(`${API_ENDPOINT}/user/changing/email`, {
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
          setActivate(2);
          setPayload("Email Successfully changed !");
        } else {
          setActivate(1);
          setPayload("Email: Invalid input");
        }
      });
  }

  function postPassword() {
    fetch(`${API_ENDPOINT}/user/changing/password`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") {
          setActivate(2);
          setPayload("New Password Successfully changed !");
        } else {
          setActivate(1);
          setPayload("New Password: Invalid input");
        }
      });
  }

  useEffect(() => {
    const formData = new FormData();
    formData.append("profile", picture);

    fetch(`${API_ENDPOINT}/user/changing/photo`, {
      credentials: "include",
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === "SUCCESS") {
          setActivate(2);
          setPayload("Photo Successfully changed !");
          getUser();
        } else {
          setActivate(1);
          setPayload("Photo: Invalid input");
        }
      });
  }, [picture]);
  return (
    <div>
      <NavBar />
      <Container component="main" maxWidth="xs">
        <Snackbar open={activate > 0} autoHideDuration={6000}>
          <Alert severity={activate === 1 ? "error" : "success"}>
            {payload}
          </Alert>
        </Snackbar>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar src={pictureUrl} />
          <Typography component="h1" variant="h5">
            Preferences
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label=""
                  name="firstName"
                  autoFocus
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={postFirstName}
                >
                  Change it
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label=""
                  name="lastName"
                  autoFocus
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={postLastName}
                >
                  Change it
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label=""
                  name="username"
                  autoFocus
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={postUsername}
                >
                  Change it
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label=""
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={postEmail}
                >
                  Change it
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="New Password"
                  name="password"
                  type="password"
                  autoFocus
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={postPassword}
                >
                  Change it
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item>
                <Typography>Prefered Language: </Typography>
              </Grid>
              <Grid item>
                <div className={classes.toggleContainer}>
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="FR" aria-label="left aligned">
                      FR
                    </ToggleButton>
                    <ToggleButton value="EN" aria-label="centered">
                      EN
                    </ToggleButton>
                    <ToggleButton value="ES" aria-label="right aligned">
                      ES
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item mt={10} py={4}>
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
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Upload NEW Profile Picture
                    </Button>
                  </label>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                href={FRONT_ENDPOINT}
              >
                BACK HOME
              </Button>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Footer />
        </Box>
      </Container>
    </div>
  );
}
