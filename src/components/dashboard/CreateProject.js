import React, { Fragment, useState, useContext, useEffect } from "react";
import { projectSave, projectUpdate } from "../../models/project";
import { AuthContext } from "../auth/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NotificationContext from "../../contexts/alertContext";

const CreateProject = () => {
  const { currentUser } = useContext(AuthContext);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    department: "",
    location: "",
    description: "",
    imgs: [],
    userid: currentUser.uid,
  });

  const uselocation = useLocation();

  // get userId
  let project = uselocation.state?.project;

  useEffect(() => {
    if (project !== undefined) {
      setUpdate(true);
      setFormData({
        name: project.name,
        category: project.category,
        department: project.department,
        location: project.location,
        description: project.description,
        imgs: project.imgs,
      });
    }
  }, [project]);
  const navigate = useNavigate();

  const notification=useContext(NotificationContext)

  const { name, category, department, location, description, imgs } = formData;
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const fileList = Array.from(e.target.files);
    const newImages = fileList.filter((file) => /image\/*/.test(file.type));
    if (newImages.length + images.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImages([...images, ...newImages]);
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
    setFormData({ ...formData, imgs: images });
    if (update) {
      try {
        await projectUpdate(formData, project.id);
        notification.success("Project Updated Successfully")
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(update);
        await projectSave(formData);
        notification.success("Project Created Successfully")
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add a Project</h1>
      <p className="lead">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate,
        asperiores!
      </p>
      <small>* - required field</small>
      <form className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="* Project Title"
            name="name"
            onChange={(e) => onChange(e)}
            value={name}
          />
        </div>
        <div className="form-group">
          <select
            name="category"
            onChange={(e) => onChange(e)}
            value={category}
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
        </div>
        <div className="form-group">
          <select
            name="department"
            onChange={(e) => onChange(e)}
            value={department}
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
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            onChange={(e) => onChange(e)}
            value={location}
          />
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
        <div className="form-group">
          <div className="upload__box">
            <div className="upload__btn-box">
              <label className="upload__btn">
                <p>Upload images</p>
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
              {images.map((image, index) => (
                <div className="upload__img-box" key={index}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded image ${index}`}
                  />
                  <button
                    className="btn btn-danger upload__img-delete"
                    onClick={() => handleImageDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <small className="small form-text">
            Upload 3 photos. Accepting formats: jpg,jpeg,png
          </small>
        </div>
        <input
          type="submit"
          className="btn btn-primary mt-2"
          onClick={(e) => onSubmit(e)}
        />
        <Link to="/dashboard" className="btn btn-light">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

export default CreateProject;
