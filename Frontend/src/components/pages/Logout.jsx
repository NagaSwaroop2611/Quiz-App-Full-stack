import React, { useEffect } from "react";
import { logoutUser } from "../../store/thunks/authThunk";
import { useDispatch } from "react-redux";
import useAuthState from "../../hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { routes } from "../../App";
import toast from "react-hot-toast";

const Logout = () => {
  const { isAuthenticated } = useAuthState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const toastShown = useRef(false);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logoutUser(false));
    }
    toast.success("logout succesful");

    const timeOutId = setTimeout(() => {
      navigate(routes.login, { replace: true });
    }, 1000);
    return () => clearTimeout(timeOutId); //clear timeout
  }, [navigate]);
  return (
    <div>
      <h1>This page will redirect in 5 seconds</h1>
      <p>Redirecting to home...</p>
    </div>
  );
};

export default Logout;
