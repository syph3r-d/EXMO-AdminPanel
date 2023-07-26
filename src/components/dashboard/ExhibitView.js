import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectGet } from "../../models/project";
import Spinner from "../layout/Spinner";
import { useNavigate,Link } from "react-router-dom";
import MapContainer from "../utils/Map";

const ExhibitView = () => {
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    faculty: "",
    department: "",
    location: {
      lat: "",
      lng: "",
      title: "",
      subtitle: "",
    },
    team: [],
    status: "",
    description: "",
    images: [],
    userid: "",
    displayImage: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const {
    title,
    caption,
    department,
    displayImage,
    description,
    location,
    team,
    images,
  } = formData;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await projectGet(id);
      console.log(data);
      setFormData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const onEdit = () => {
    navigate("/create-project", {
      state: {
        project: formData,
        type: "exhibits",
      },
    });
  };
  const handleMapLocationChange = (latitude, longitude) => {
    setFormData({
      ...formData,
      location: { ...location, latitude, longitude },
    });
  };
  return (
    <div>
      <div className="card larger">
        {isLoading ? (
          <Spinner></Spinner>
        ) : (
          <Fragment>
            <div className="heading">
              <div className="displayImage">
                <img src={displayImage} alt="" />
              </div>
              <div className="details">
                <div className="large text-primary">{title}</div>
                <p className="caption">{caption}</p>
                <p className="caption">{department}</p>
                {/* show each team member in 'team' separated by "|" */}
                
                
                <p className="caption">
                  {team.map((member,index) => (
                    index===0?member:<span> | {member} </span>
                  ))}
                </p>
                <button
                  className="btn btn-primary mt-1"
                  onClick={() => onEdit()}
                >
                  <i className="fa fa-marker" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <p className="description">{description}</p>
            <div className="location">
              <MapContainer onMapLocationChange={handleMapLocationChange} />
            </div>
            {/* <div className="location">
              <p>Location</p>
            </div> */}
            <div className="displayimages">
              <img src="./606224.png" alt="" />
              <img src="./606224.png" alt="" />
              <img src="./606224.png" alt="" />
            </div>
            <Link to="/exhibits" className="btn btn-light mt-1">
            Go Back
          </Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ExhibitView;
