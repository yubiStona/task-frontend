import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { apiSlice } from "./apiSlice";

export const useAuthErrorHandler = (error) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      error?.status === 401 &&
      error.data?.message !== "CSRF token missing" &&
      error.data?.message !== "Invalid CSRF token" &&
      !error.originalStatus?.url?.includes("/csrf-token")
    ) {
      // Just dispatch logout action and redirect
      dispatch(apiSlice.util.resetApiState());
      dispatch(logout());
      navigate("/login");
    }
  }, [error, dispatch, navigate]);
};
