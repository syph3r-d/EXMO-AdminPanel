import React, { Fragment, useState, useContext, useEffect } from "react";
import Spinner from "../layout/Spinner";
import {
  projectSave,
  projectUpdate,
  deleteImages,
  updateImages,
} from "../../models/project";
import { AuthContext } from "../auth/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NotificationContext from "../../contexts/alertContext";
import MapContainer from "../utils/Map";
import FileUpload from "../utils/fileUpload";
import { set } from "firebase/database";

const CreateProject = () => {
  const { currentUser } = useContext(AuthContext);
  const [type, setType] = useState("exhibits");
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    displayImage: "",
    location: {
      building: "",
      floor: 0,
      section: "",
      latitude: 0,
      longitude: 0,
    },
    caption: "",
    department: "",
    description: "",
    hours: [{ start: "", end: "" }],
    images: [],
    team: [""],
    status: "0",
    userid: currentUser.uid,
  });
  const [deleted, setDeleted] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const uselocation = useLocation();

  let project = uselocation.state?.project;

  useEffect(() => {
    if (project !== undefined) {
      setUpdate(true);
      console.log(project);
      setFormData({
        title: project.title,
        caption: project.caption,
        displayImage: project.displayImage,
        team: project.team,
        status: project.status,
        department: project.department,
        location: project.location,
        description: project.description,
        images: project.images,
      });
    }
  }, [project]);
  const navigate = useNavigate();

  const notification = useContext(NotificationContext);

  const {
    title,
    caption,
    team,
    status,
    department,
    location,
    description,
    displayImage,
    images,
  } = formData;

  const handleImageChange = (e) => {
    const fileList = Array.from(e.target.files);
    const newImages = fileList.filter((file) => /image\/*/.test(file.type));
    if (newImages.length + imgs.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImgs([...imgs, ...newImages]);
  };

  const handleProjectImageDelete = (url, index) => {
    setDeleted((deleted) => [...deleted, images[index]]);
    const newimgs = [...images];
    newimgs.splice(index, 1);
    setFormData({ ...formData, images: newimgs });
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImgs(newImages);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (update) {
      try {
        await projectUpdate(formData, project.id);
        if (images.length > 0) {
          await updateImages(project.id, images, notification);
        }
        if (deleted.length > 0) {
          await deleteImages(deleted, project.id);
        }
        notification.success("Project Updated Successfully");
        setIsLoading(false);
        navigate("/dashboard");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    } else {
      try {
        await projectSave(formData, imgs, thumbnail, type, notification);
        notification.success("Project Created Successfully");
        setIsLoading(false);
        navigate("/dashboard");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  // const onTimeChange = (e, index) => {
  //   const newHours = [...hours];
  //   newHours[index] = { ...newHours[index], [e.target.name]: e.target.value };
  //   setFormData({ ...formData, hours: newHours });
  // };

  const handleThumbChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const onTeamChange = (e, index) => {
    const newTeam = [...team];
    newTeam[index] = e.target.value;
    setFormData({ ...formData, team: newTeam });
  };

  const handleMapLocationChange = (latitude, longitude) => {
    setFormData({
      ...formData,
      location: { ...location, latitude, longitude },
    });
  };

  const addMember = (e) => {
    e.preventDefault();
    const newTeam = [...team];
    newTeam.push("");
    setFormData({ ...formData, team: newTeam });
  };

  const removeMember = (e, index) => {
    e.preventDefault();
    const newTeam = [...team];
    newTeam.splice(index, 1);
    setFormData({ ...formData, team: newTeam });
  };

  // const addTime = (e) => {
  //   e.preventDefault();
  //   const newHours = [...hours];
  //   newHours.push({ start: "", end: "" });
  //   setFormData({ ...formData, hours: newHours });
  // };

  // const removeTime = (e, index) => {
  //   e.preventDefault();
  //   const newHours = [...hours];
  //   newHours.splice(index, 1);
  //   setFormData({ ...formData, hours: newHours });
  // };
  const onChangeType = (e) => {
    setType(e.target.value);
  };
  return (
    <Fragment>
      <div className="card">
        <h1 className="large text-primary">Add an Exhibit</h1>
        <p className="lead">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate,
          asperiores!
        </p>
        <small>* - required field</small>
        <form className="form">
          <div className="form-group">
            <select
              name="type"
              onChange={(e) => onChangeType(e)}
              value={type}
              required
            >
              <option value="0">* Select Type</option>
              <option value="lecture">Lecture</option>
              <option value="exhibits2">Exhibit</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Exhibit Title"
              name="title"
              onChange={(e) => onChange(e)}
              value={title}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Exhibit Caption"
              name="caption"
              onChange={(e) => onChange(e)}
              value={caption}
              required
            />
          </div>
          <div className="form-group">
            {team.map((member, index) => (
              <div className="twocolumns">
                <input
                  key={index}
                  type="text"
                  placeholder={`Team Member ${index + 1}`}
                  name="team"
                  onChange={(e) => onTeamChange(e, index)}
                  value={team[index]}
                  required
                />
                {index === 0 ? (
                  <Fragment></Fragment>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => removeMember(e, index)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              className="btn btn-primary mt-1"
              onClick={(e) => addMember(e)}
            >
              Add a New Member
            </button>
          </div>
          <div className="form-group">
            <select
              name="status"
              onChange={(e) => onChange(e)}
              value={status}
              required
            >
              <option value="0">* Select Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
          <div className="form-group">
            <label className="upload__btn">
              <h4>Thumbnail :</h4>
              <input
                type="file"
                accept="image/*"
                data-max_length="20"
                className="upload__inputfile"
                onChange={handleThumbChange}
              />
            </label>
            <div className="upload__img-wrap">
              {thumbnail === null ? (
                <Fragment></Fragment>
              ) : (
                <div className="upload__img-box">
                  <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setThumbnail(null)}
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              )}
              {displayImage !== "" ? (
                <div className="upload__img-box">
                  <img src={displayImage} alt="Thumbnail" />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      setFormData({ ...formData, displayImage: "" })
                    }
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              ) : (
                <Fragment></Fragment>
              )}
            </div>
          </div>
          {/* {hours.map((hour, index) => (
            <div key={index} className="twocolumns">
              <div className="form-group">
                <label htmlFor="start">Start Time</label>
                <input
                  type="datetime-local"
                  name="start"
                  onChange={(e) => onTimeChange(e, index)}
                  value={hours[index].start}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end">End Time</label>
                <input
                  type="datetime-local"
                  name="end"
                  onChange={(e) => onTimeChange(e, index)}
                  value={hours[index].end}
                  required
                />
              </div>
              {index === 0 ? (
                <Fragment></Fragment>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ maxHeight: "50px", margin: "auto 0" }}
                  onClick={(e) => removeTime(e, index)}
                >
                  X
                </button>
              )}
            </div>
          ))} */}
          {/* <button className="btn btn-primary" onClick={(e) => addTime(e)}>
            Add New Time Slot
          </button> */}

          {/* <div className="form-group">
            <select
              name="category"
              onChange={(e) => onChange(e)}
              value={category}
              required
            >
              <option value="0">* Select Category</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Automobile">Automobile</option>
              <option value="A.I.">A.I.</option>
              <option value="Robotic">Robotic</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Compettion">Compettion</option>
              <option value="Other">Other</option>
            </select>
          </div> */}
          <div className="form-group">
            <select
              name="department"
              onChange={(e) => onChange(e)}
              value={department}
              required
            >
              <option value="0">* Select Department</option>
              <option value="Faculty of Medicine">Faculty of Medicine</option>
              <option value="Faculty of Information Technology">
                Faculty of Information Technology
              </option>
              <option value="Faculty of Business">Faculty of Business</option>
              <option value="UOM Facilities Management">
                UOM Facilities Management
              </option>
              <option value="Town & Country Planning">
                Town & Country Planning
              </option>
              <option value="Fashion and Textile Design">
                Fashion and Textile Design
              </option>
              <option value="Building Economics">Building Economics</option>
              <option value="Integrated Design">Integrated Design</option>
              <option value="Architecture">Architecture</option>
              <option value="Chemical & Process Engineering">
                Chemical & Process Engineering
              </option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Earth Resources Engineering">
                Earth Resources Engineering
              </option>
              <option value="Electrical Engineering">
                Electrical Engineering
              </option>
              <option value="Electronic & Telecommunication Engineering">
                Electronic & Telecommunication Engineering
              </option>
              <option value="Material Science & Engineering">
                Material Science & Engineering
              </option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science & Engineering">
                Computer Science & Engineering
              </option>
              <option value="Textile & Apparel Engineering">
                Textile & Apparel Engineering
              </option>
            </select>
          </div>
          <div className="location">
            <MapContainer onMapLocationChange={handleMapLocationChange} />
          </div>
          <div className="form-group">
            <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="Project Description"
              onChange={(e) => onChange(e)}
              value={description}
            ></textarea>
          </div>
          <small className="form-text">
            Give people an idea of your project
          </small>
          {isLoading ? (
            <Fragment>
              <Spinner />
            </Fragment>
          ) : (
            <Fragment></Fragment>
          )}
          <div className="form-group">
            <div className="upload__box">
              <div className="upload__btn-box">
                <label className="upload__btn">
                  <h4>Upload images :</h4>
                  <input
                    type="file"
                    multiple=""
                    max="3"
                    accept="image/*"
                    data-max_length="20"
                    className="upload__inputfile"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="upload__img-wrap">
                {images?.length > 0 ? (
                  images.map((imgUrl, index) => (
                    <Fragment>
                      <div className="upload__img-box" key={index}>
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`project-img-${index}`}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleProjectImageDelete(imgUrl, index)
                          }
                        >
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                      </div>
                    </Fragment>
                  ))
                ) : (
                  <Fragment></Fragment>
                )}
                {imgs.map((image, index) => (
                  <div className="upload__img-box" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`upload-img-${index}`}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleImageDelete(index)}
                    >
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <small className="small form-text">
              Upload 3 photos. Accepting any image format
            </small>
          </div>
          <input
            type="submit"
            className="btn btn-primary mt-1"
            onClick={(e) => onSubmit(e)}
          />
          <Link to="/dashboard" className="btn btn-light">
            Go Back
          </Link>
        </form>
      </div>
      {/* <FileUpload /> */}
    </Fragment>
  );
};

export default CreateProject;
