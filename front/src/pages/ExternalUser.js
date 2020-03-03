import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { API_ENDPOINT } from "../constant";
import Footer from "../components/Footer";
import Box from "@material-ui/core/Box";

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

export default function ExternalUser(props) {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  function getUser() {
    fetch(`${API_ENDPOINT}/user/external/${props.match.params.uuid}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        setUser(res.user);
      });
  }
  if (user === null) getUser();
  return (
    <div>
      <NavBar />
      <Container component="main" maxWidth="xs">
        <Paper>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <img
                alt=""
                src={user !== null && user.photo !== null ? user.photo : null}
              />
            </Avatar>
            <Typography component="h1" variant="h5">
              Profile
            </Typography>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="center">Username</TableCell>
                <TableCell>
                  {user !== null && user.username !== null
                    ? user.username
                    : "none"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">First Name</TableCell>
                <TableCell>
                  {user !== null && user.givenName !== null
                    ? user.givenName
                    : "none"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Last Name</TableCell>
                <TableCell>
                  {user !== null &&
                  user.familyname !== null &&
                  user.familyname !== ""
                    ? user.familyname
                    : "none"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <Box mt={5}>
          <Footer />
        </Box>
      </Container>
    </div>
  );
}
