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
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    thumbnail: "",
    displayImage: "",
    location: {
      building: "",
      floor: 0,
      section: "",
      latitude: 0,
      longitude: 0,
    },
    faculty: "",
    caption: "",
    department: "",
    description: "",
    hours: [{ start: "", end: "" }],
    images: [],
    team: [""],
    status: "",
    userid: currentUser.uid,
  });
  const [deleted, setDeleted] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const uselocation = useLocation();

  let project = uselocation.state?.project;

  useEffect(() => {
    if (project !== undefined) {
      setUpdate(true);
      setFormData({
        title: project.title,
        subtitle: project.subtitle,
        faculty: project.faculty,
        hours: project.hours,
        team: project.team,
        status: project.status,
        department: project.department,
        location: project.location,
        description: project.description,
        imgs: project.imgs,
      });
    }
  }, [project]);
  const navigate = useNavigate();

  const notification = useContext(NotificationContext);

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
    description,
    imgs,
  } = formData;

  const handleImageChange = (e) => {
    const fileList = Array.from(e.target.files);
    const newImages = fileList.filter((file) => /image\/*/.test(file.type));
    if (newImages.length + images.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImages([...images, ...newImages]);
  };

  const handleProjectImageDelete = (url, index) => {
    setDeleted((deleted) => [...deleted, imgs[index]]);
    const newimgs = [...imgs];
    newimgs.splice(index, 1);
    setFormData({ ...formData, imgs: newimgs });
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    return;
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
        await projectSave(formData, images, notification);
        notification.success("Project Created Successfully");
        setIsLoading(false);
        navigate("/dashboard");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  const onTimeChange = (e, index) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, hours: newHours });
  };

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

  const addTime = (e) => {
    e.preventDefault();
    const newHours = [...hours];
    newHours.push({ start: "", end: "" });
    setFormData({ ...formData, hours: newHours });
  };

  const removeTime = (e, index) => {
    e.preventDefault();
    const newHours = [...hours];
    newHours.splice(index, 1);
    setFormData({ ...formData, hours: newHours });
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
              placeholder="* Exhibit Sub-Title"
              name="subtitle"
              onChange={(e) => onChange(e)}
              value={subtitle}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Faculty"
              name="faculty"
              onChange={(e) => onChange(e)}
              value={faculty}
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
            <input
              type="text"
              placeholder="Status"
              name="status"
              onChange={(e) => onChange(e)}
              value={status}
              required
            />
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
            {/* <div className="upload__img-wrap">
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
            </div> */}
          </div>
          {hours.map((hour, index) => (
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
          ))}
          <button className="btn btn-primary" onClick={(e) => addTime(e)}>
            Add New Time Slot
          </button>

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
              <option value="Mechanical">Mechanical</option>
              <option value="ENTC">ENTC</option>
              <option value="CSE">CSE</option>
              <option value="Chemical">Chemical</option>
              <option value="Material">Material</option>
              <option value="Electrical">Electrical</option>
              <option value="Civil">Civil</option>
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
                {imgs?.length > 0 ? (
                  imgs.map((imgUrl, index) => (
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
                {images.map((image, index) => (
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
      <FileUpload />
    </Fragment>
  );
};

export default CreateProject;
