import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Pages/Layout.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Username from "./Pages/Username.jsx";
import Login from "./Pages/Login.jsx";
import TransactionsTable from "./components/TransactionsTable.jsx";
import { Provider } from "react-redux";
import store from "../Redux/Store.js";
import RegisterPage from "./Pages/Register.jsx";
import ManageUser from "./components/ManageUser.jsx";
import Credential from "./components/Credential.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="*" element={<ErrorPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Username />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transaction" element={<TransactionsTable />} />
            <Route path="users" element={<ManageUser />} />
            <Route path="credential" element={<Credential />} />
         
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);