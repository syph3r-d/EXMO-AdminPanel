import React, { Fragment, useState ,useEffect} from "react";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import NotificationContext from "../../contexts/alertContext";
import { Link,useNavigate } from "react-router-dom";
import Spinner from "../layout/Spinner";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const [isLoading,setIsLoading]=useState(false)

  const navigate = useNavigate();

  const {currentUser,signIn} = useContext(AuthContext);

  useEffect(() => {
    if (!(currentUser == null) ) {
      navigate("/dashboard");
    }
  }, [currentUser]);

  const notification = useContext(NotificationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      await signIn(email, password);
    } catch (error) {
      setIsLoading(false)
      notification.error("Invalid Credentials");
      console.log(error);
    }
  };

  const onChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  return (
    <Fragment>
      {isLoading ? <Fragment><Spinner/></Fragment> : <Fragment></Fragment>}
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">Sign In to Your Account</p>
      <form className="form">
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" onChange={(e)=>onChange(e)} value={email} />
          <div className="small form-text"></div>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" minLength="6" name="password" onChange={(e)=>onChange(e)} value={password}/>
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

    </Fragment>
  );
}

export default SignIn;
