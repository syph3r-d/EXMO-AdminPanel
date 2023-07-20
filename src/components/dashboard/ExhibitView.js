import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectGet } from "../../models/project";
import Spinner from "../layout/Spinner";

const ExhibitView = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    faculty: "",
    department: "",
    location: {
      lat: "",
      lng: "",
      title: "",
      subtitle: "",
    },
    hours: {
      start: "",
      end: "",
    },
    team: [],
    status: "",
    description: "",
    imgs: [],
    userid: "",
    thumbnail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const {
    title,
    subtitle,
    faculty,
    hours,
    team,
    status,
    category,
    department,
    location,
    thumbnail,
    description,
    imgs,
  } = formData;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await projectGet(id);
      setFormData(data);
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
              <div className="thumbnail">
                <img src={thumbnail} alt="" />
              </div>
              <div className="details">
                <div className="large text-primary">{title}</div>
                <p className="subtitle">{subtitle}</p>
                <p className="subtitle">
                  {faculty} | {department}
                </p>
                <p className="subtitle">Team Member 1 | Team Member 2</p>
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
