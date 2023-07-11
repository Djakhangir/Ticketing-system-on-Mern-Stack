import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import DefaultLayout from "../../Layout/DefaultLayout";
import { loginSuccess } from "../Login/loginSlice";
import { fetchNewAccessJWT } from "../../Api/userApi";
import { getUserProfile } from "../../Pages/Dashboard/userAction";

const PrivateRouter = ({ children, ...rest }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.login);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const updateAccessJWT = async() => {
    const result = await fetchNewAccessJWT();
    result && dispatch(loginSuccess());
  };
  !user._id && dispatch(getUserProfile());
!sessionStorage.getItem('accessJWT') && localStorage.getItem('buildingmgmSite') && updateAccessJWT();

    !isAuth && sessionStorage.getItem("accessJWT") && dispatch(loginSuccess());
  }, [dispatch, isAuth, user._id]);

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
