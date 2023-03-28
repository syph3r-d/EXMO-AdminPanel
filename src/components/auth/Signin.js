import React, { Fragment, useState ,useEffect} from "react";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import NotificationContext from "../../contexts/alertContext";
import { Link,useNavigate } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  const {currentUser,signIn} = useContext(AuthContext);

  useEffect(() => {
    if (!(currentUser == null)) {
      navigate("/dashboard");
    }
  }, [currentUser]);

  const notification = useContext(NotificationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password);
    } catch (error) {
      notification.error("Invalid Credentials");
      console.log(error);
    }
  };

  const onChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  return (
    <Fragment>
      <h1 class="large text-primary">Sign In</h1>
      <p class="lead">Sign In to Your Account</p>
      <form action="dashboard.html" class="form">
        <div class="form-group">
          <input type="email" placeholder="Email Address" name="email" onChange={(e)=>onChange(e)} value={email} />
          <div class="small form-text"></div>
        </div>
        <div class="form-group">
          <input type="password" placeholder="Password" minlength="6" name="password" onChange={(e)=>onChange(e)} value={password}/>
        </div>
        <input
          type="submit"
          value="Login"
          class="btn btn-primary"
          onClick={(e) => handleSubmit(e)}
        />
      </form>
      <p class="mt-1">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </Fragment>
  );
}

export default SignIn;
