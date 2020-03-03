import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import PrivateRoute from "./PrivateRoute";
import ResetPassword from "./pages/PassReset";
import ResetingPassword from "./pages/PassResetConf";
import UserEdition from "./pages/UserEdition";
import NotFound from "./pages/NotFound";
import FilmPage from "./pages/FilmPage";
import ExternalUser from "./pages/ExternalUser";

function App(props) {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/preferences" component={UserEdition} />
        <PrivateRoute path="/film/:id" component={FilmPage} />
        <PrivateRoute path="/user/:uuid" component={ExternalUser} />
        <Route exact path="/sign-in" component={SignIn} />
        <Route path="/sign-in/:uuid/:token" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/password-reset" component={ResetPassword} />
        <Route
          path="/password-reseting/:uuid/:token"
          component={ResetingPassword}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
