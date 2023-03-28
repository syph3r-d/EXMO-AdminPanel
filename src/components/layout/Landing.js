import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <Fragment>
      <div class="dark-overlay">
        <div class="landing-inner">
          <h1 class="x-large">EXMO Member's Portal</h1>
          <p class="lead">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloribus
            voluptate commodi minus consequatur rem adipisci consectetur quia,
            esse facilis fuga!
          </p>
          <div class="buttons">
            <Link to="/register" class="btn btn-primary">Sign up</Link>
            <Link to="/login" class="btn btn">Login</Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Landing
