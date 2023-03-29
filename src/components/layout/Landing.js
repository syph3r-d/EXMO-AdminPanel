import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Fragment>
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">EXMO Member's Portal</h1>
            <p className="lead">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Doloribus voluptate commodi minus consequatur rem adipisci
              consectetur quia, esse facilis fuga!
            </p>
            <div className="buttons">
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
              <Link to="/login" className="btn btn">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Landing;
