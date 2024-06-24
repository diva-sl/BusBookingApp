import axios from "axios";
import React, { useEffect } from "react";
import Login from ".pages/Login";
import Register from ".pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./component/PublicRoute";
import ProtecedRoute from "./component/ProtecedRoute";
import Home from "./pages/Home";
import AdminBuses from "./pages/admin/AdminBuses";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import BookNow from "./pages/BookNow";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtecedRoute>
                <Home />
              </ProtecedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtecedRoute>
                <AdminHome />
              </ProtecedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtecedRoute>
                <AdminBuses />
              </ProtecedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtecedRoute>
                <AdminUsers />
              </ProtecedRoute>
            }
          />
          <Route
            path="/book-now/:id"
            element={
              <ProtecedRoute>
                <BookNow />
              </ProtecedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
