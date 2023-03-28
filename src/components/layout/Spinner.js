import React from "react";
import spinner from "../../img/loader.gif";

const Spinner = () => {
  return (
    <div>
      <div className="landing-inner">
        <img
          src={spinner}
          style={{ width: "50px", margin: "auto auto" ,zIndex:'2'}}
        />
      </div>
    </div>
  );
};

export default Spinner;
