import React, { Fragment, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import NotificationContext from "../../contexts/alertContext";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../layout/Spinner";
// import { loginUser, useAuthState, useAuthDispatch } from "../contexts/context";
import { loginUser, useAuthDispatch, useAuthState } from "../../contexts";

function SignIn() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = formData;

  const navigate = useNavigate();

  // const { userDetails, signIn } = useContext(AuthContext);
  const { userDetails,loading } = useAuthState();

  useEffect(() => {
    if (!(userDetails == "")) {
      navigate("/dashboard");
    }
  }, [userDetails]);

  const notification = useContext(NotificationContext);

  const dispatch = useAuthDispatch(); //get the dispatch method from the useDispatch custom hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { username, password };
    try {
      let response = await loginUser(dispatch, payload); //loginUser action makes the request and handles all the neccessary state changes
      console.log(response);
      if (!response) return;
      // window.location = "/dashboard";
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      {loading ? (
        <Fragment>
          <div className="alert-display">
            <Spinner />
          </div>
        </Fragment>
      ) : (
        <Fragment></Fragment>
      )}
      <div className="card">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">Sign In to Your Account</p>
        <form className="form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="username"
              onChange={(e) => onChange(e)}
              value={username}
              required
            />
            <div className="small form-text"></div>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              minLength="6"
              name="password"
              onChange={(e) => onChange(e)}
              value={password}
              required
            />
          </div>
          <input
            type="submit"
            value="Login"
            className="btn btn-primary"
            onClick={(e) => handleSubmit(e)}
          />
        </form>
        <p className="mt-1">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </Fragment>
  );
}

export default SignIn;
