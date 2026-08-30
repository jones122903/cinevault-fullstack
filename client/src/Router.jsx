import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import AdminLayout from "./pages/AdminLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Actor from "./pages/actor/Actor";
import Producer from "./pages/producer/Producer";
import Movie from "./pages/movie/Movie";

import Common from "./common/common";
import ToastOverlay from "./components/ToastOverlay";

/* =====================================
   Protected Route
===================================== */

const ProtectedRoute = () => {
  const token =
    localStorage.getItem("accessToken");

  const { toast } = Common();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <AdminLayout>
      <ToastOverlay
        message={toast.message}
        type={toast.type}
      />

      <Outlet />
    </AdminLayout>
  );
};

/* =====================================
   Entity Child Routes
===================================== */

const generateRoutes = (Component) => (
  <>
    {/* Main list */}
    <Route
      index
      element={<Component />}
    />

    {/* Add */}
    <Route
      path="add"
      element={
        <Component
          addState={true}
        />
      }
    />

    {/* Edit */}
    <Route
      path="edit/:id"
      element={
        <Component
          editState={true}
        />
      }
    />

    {/* View */}
    <Route
      path=":id"
      element={
        <Component
          viewState={true}
        />
      }
    />
  </>
);

/* =====================================
   Router
===================================== */

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =============================
            Public
        ============================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =============================
            Protected
        ============================= */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          {/* Movies */}

          <Route
            path="/movies"
            element={<Outlet />}
          >
            {generateRoutes(Movie)}
          </Route>

          {/* Actors */}

          <Route
            path="/actors"
            element={<Outlet />}
          >
            {generateRoutes(Actor)}
          </Route>

          {/* Producers */}

          <Route
            path="/producers"
            element={<Outlet />}
          >
            {generateRoutes(Producer)}
          </Route>

          {/* Root */}

          <Route
            path="/"
            element={
              <Navigate
                to="/movies"
                replace
              />
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;