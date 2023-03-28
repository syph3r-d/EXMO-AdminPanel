import React, { Fragment,useContext,useEffect,useState } from 'react'
import { AuthContext } from "../auth/authContext";
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [isLogged,setIsLogged]=useState(false)
    const {currentUser,signOutUser} = useContext(AuthContext);

    useEffect(() => {
      if (!(currentUser == null)) {
        setIsLogged(true)
      }
    }, [currentUser]);

    const handlelogout=()=>{
        signOutUser();
        setIsLogged(false)
    }
  return (
    <Fragment>
      <nav className="navbar bg-dark">
        <div className="logo">
            <img src="logo-uom.png" alt=""/>
          <h1>
            <a href="dashboard.html"> EXMO UoM </a>
          </h1>
        </div>
        <ul>
            {isLogged ? (<Fragment><li><Link href="/dashboard"><i className="fas fa-user"></i> Dashboard</Link></li>
          <li><Link onClick={()=>handlelogout()}><i className="fas fa-sign-out-alt"></i> Logout</Link></li></Fragment>) : (<Fragment><li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li></Fragment>)}
        </ul>
      </nav>
    </Fragment>
  )
}

export default Navbar
