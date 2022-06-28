import React from "react";
import { Route, Redirect } from "react-router-dom";
import DefaultLayout from "../../Layout/DefaultLayout";

const PrivateRouter = ({ children, ...rest }) => {
    const isAuth = true;
  return (
    <Route
    {...rest}
      render={() =>
        isAuth ? <DefaultLayout>{children}</DefaultLayout> : <Redirect to="/" />
      }
    />
  );
};
export default PrivateRouter;