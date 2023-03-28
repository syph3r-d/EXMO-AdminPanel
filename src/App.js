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

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log(user)
    });

    return unsubscribe;
  }, []);

  return (
    <AuthProvider >
      <NotificationProvider>
        <Router>
          <Fragment>
            <Navbar />
            <section className="container">
              <Alert/>
              <Routes>
                <Route exact path="/" element={<Landing />} />
                <Route exact path="/login" element={<Signin />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/create-project" element={<CreateProject />} />
              </Routes>
            </section>
          </Fragment>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
