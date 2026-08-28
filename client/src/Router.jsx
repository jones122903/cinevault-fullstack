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

// Entity Pages
import Actor from "./pages/actor/Actor";
import Producer from "./pages/producer/Producer";
import Movie from "./pages/movie/Movie";
import Common from "./common/common";
import ToastOverlay from "./components/ToastOverlay";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  const { showToast, toast } = Common();
  return token ? (
    <AdminLayout>
      <ToastOverlay message={toast.message} type={toast.type} />
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

const generateRoutes = (basePath, Component) => (
  <>
    <Route index element={<Component />} />
    <Route path="add" element={<Component addState={true} />} />
    <Route path=":id" element={<Component viewState={true} />} />
    <Route path="edit/:id" element={<Component editState={true} />} />
  </>
);

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/actors/*" element={<Outlet />}>
            {generateRoutes("", Actor)}
          </Route>
          <Route path="/producers/*" element={<Outlet />}>
            {generateRoutes("", Producer)}
          </Route>
          <Route path="/movies/*" element={<Outlet />}>
            {generateRoutes("", Movie)}
          </Route>

          {/* Redirect root to actors */}
          <Route path="/" element={<Navigate to="/actors" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
