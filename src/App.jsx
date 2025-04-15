import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersListPage from "./pages/UsersListPage";
import UserFormPage from "./pages/UserFormPage";
import TasksListPage from "./pages/TasksListPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import UserDashboard from "./pages/UserDashboard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetCsrfTokenQuery } from "./features/auth/authApi";
import {
  selectIsCsrfInitialized,
  setCsrfToken,
} from "./features/auth/authSlice";
function App() {
  const dispatch = useDispatch();

  const initialized = useSelector(selectIsCsrfInitialized);
  const [trigger, { data, isSuccess }] = useLazyGetCsrfTokenQuery();

  useEffect(() => {
    if (!initialized) {
      trigger();
    }
  }, [initialized, trigger]);

  useEffect(() => {
    if (isSuccess && data?.csrfToken) {
      dispatch(setCsrfToken(data.csrfToken));
    }
  }, [isSuccess, data, dispatch]);
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/user-dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="profile" element={<ProfilePage />} />

        {/* Admin Only Routes */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute adminOnly>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute adminOnly>
              <UsersListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="users/new"
          element={
            <PrivateRoute adminOnly>
              <UserFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="users/:id/edit"
          element={
            <PrivateRoute adminOnly>
              <UserFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="tasks"
          element={
            <PrivateRoute adminOnly>
              <TasksListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="tasks/new"
          element={
            <PrivateRoute adminOnly>
              <TaskFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="tasks/:id/edit"
          element={
            <PrivateRoute adminOnly>
              <TaskFormPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
