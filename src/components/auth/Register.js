import React, { Fragment, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationContext from "../../contexts/alertContext";
import { AuthContext } from "./authContext";
import Spinner from "../layout/Spinner";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();

  const { currentUser, signUp } = useContext(AuthContext);

  useEffect(() => {
    if (!(currentUser == null)) {
      navigate("/dashboard");
    }
  }, [currentUser]);

  const notification = useContext(NotificationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      notification.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password);
      setIsLoading(false);
    } catch (error) {
      notification.error("Email Already Registered");
      setIsLoading(false);
      console.log(error);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      {isLoading ? (
        <Fragment>
          <div className="alert-display">
            <Spinner />
          </div>
        </Fragment>
      ) : (
        <Fragment></Fragment>
      )}
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">Create Your Account</p>
      <form action="dashboard.html" className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={(e) => onChange(e)}
            value={name}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={(e) => onChange(e)}
            value={email}
          />
          <div className="small form-text">Use your UoM email</div>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            minlength="6"
            name="password"
            onChange={(e) => onChange(e)}
            value={password}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            minlength="6"
            name="password2"
            onChange={(e) => onChange(e)}
            value={password2}
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="btn btn-primary"
          onClick={(e) => handleSubmit(e)}
        />
      </form>
      <p className="mt-1">
        Already have an account? <a href="login">Sign in</a>
      </p>
    </Fragment>
  );
}

export default SignUp;
