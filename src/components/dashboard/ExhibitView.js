import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectGet } from "../../models/project";
import Spinner from "../layout/Spinner";

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
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  console.log(formData);
  const {
    title,
    caption,
    faculty,
    department,
    displayImage,
    description,
    images,
  } = formData;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await projectGet(id);
      console.log(data);
      // setFormData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
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
                <p className="caption">
                  {faculty} | {department}
                </p>
                <p className="caption">Team Member 1 | Team Member 2</p>
                <button className="btn btn-primary mt-1">
                  <i className="fa fa-marker" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <p className="description">{description}</p>
            <div className="location">
              <p>Location</p>
            </div>
            <div className="displayimages">
              <img src="./606224.png" alt="" />
              <img src="./606224.png" alt="" />
              <img src="./606224.png" alt="" />
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ExhibitView;
