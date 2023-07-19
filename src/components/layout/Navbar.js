import React, { Fragment,useContext,useEffect,useState } from 'react'
import { AuthContext } from "../auth/authContext";
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [isLogged,setIsLogged]=useState(false)
    const {currentUser,signOutUser} = useContext(AuthContext);

    useEffect(() => {
      if (!(currentUser == null)) {
        setIsLogged(true)
      }else{
        setIsLogged(false)
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
            <Link to="/dashboard"> EXMO UoM </Link>
          </h1>
        </div>
        <ul>
            {isLogged ? (<Fragment><li><Link to="/dashboard"><i className="fa-solid fa-border-all"></i> Control Panel</Link></li>
          <li><Link onClick={()=>handlelogout()}><i className="fas fa-sign-out-alt"></i> Logout</Link></li></Fragment>) : (<Fragment><li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li></Fragment>)}
        </ul>
      </nav>
    </Fragment>
  )
}

export default Navbar
