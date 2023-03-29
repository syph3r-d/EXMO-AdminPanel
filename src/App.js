import "./App.css";
import { Fragment, useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./components/auth/Signin";
import Register from "./components/auth/Register";
import AuthProvider from "./components/auth/authContext";
import { auth } from "./config/db";
import { NotificationProvider } from "./contexts/alertContext";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProject from "./components/dashboard/CreateProject";
import ProtectedRoute from "./components/route/Protected";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Fragment>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Landing />} />

              <Route
                exact
                path="/login"
                element={
                  <section className="container">
                    <Alert />
                    <Signin />
                  </section>
                }
              />
              <Route
                exact
                path="/register"
                element={
                  <section className="container">
                    <Alert />
                    <Register />
                  </section>
                }
              />
              <Route
                exact
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <section className="container">
                      <Alert />
                      <Dashboard />
                    </section>
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/create-project"
                element={
                  <ProtectedRoute>
                    <section className="container">
                      <Alert />
                      <CreateProject />
                    </section>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Fragment>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
