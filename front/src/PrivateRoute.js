import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { API_ENDPOINT } from "./constant";

function PrivateRoute({ component: Component, ...rest }) {
  const [log, setLog] = useState(null);

  function AuthCheck() {
    fetch(`${API_ENDPOINT}/user/me`, {
      credentials: "include",
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        if (res.uuid === undefined || res.uuid === null) {
          setLog(false);
        } else setLog(true);
      });
  }
  if (log === null) AuthCheck();
  if (log !== null && log === false) return <Redirect to="/sign-in" />;
  else return <Route {...rest} render={props => <Component {...props} />} />;
}

export default PrivateRoute;
