import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { FRONT_ENDPOINT, API_ENDPOINT } from "../constant";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function NavBar() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  function logOut() {
    fetch(`${API_ENDPOINT}/auth/logout`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    });
    setRedirect(true);
  }
  return (
    <div className={classes.root}>
      {redirect === true ? <Redirect to="/sign-in" /> : null}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button href={`${FRONT_ENDPOINT}`}> HYPERTUBE </Button>
          </Typography>

          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              href={`${FRONT_ENDPOINT}/preferences`}
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div>
            <IconButton
              aria-label="LoOout"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={logOut}
            >
              <ExitToApp />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
