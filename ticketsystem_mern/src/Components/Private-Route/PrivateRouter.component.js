import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import DefaultLayout from "../../Layout/DefaultLayout";
import { loginSuccess } from "../Login/loginSlice";
import { fetchNewAccessJWT } from "../../Api/userApi";

const PrivateRouter = ({ children, ...rest }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.login);

  useEffect(() => {
    const updateAccessJWT = async() => {
    const result = await fetchNewAccessJWT();
    result && dispatch(loginSuccess())
  };

  updateAccessJWT();
    sessionStorage.getItem("accessJWT") && dispatch(loginSuccess());
  }, [dispatch]);
  return (
    <Route
      {...rest}
      render={() =>
        isAuth ? (<DefaultLayout>{children}</DefaultLayout>) : (<Redirect to="/" />)
      }
    />
  );
};
export default PrivateRouter;
