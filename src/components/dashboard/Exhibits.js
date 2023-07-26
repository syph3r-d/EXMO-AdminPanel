import React, { Fragment, useEffect, useContext, useState } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { Firestore } from "../../config/db";
import { getDocs, collection, query, where } from "firebase/firestore";
import NotificationContext from "../../contexts/alertContext";
import { deleteProject, deleteUserProjects } from "../../models/project";
import { getProjects } from "../../models/project";
import MapContainer from "../utils/Map";

const Exhibits = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const notification = useContext(NotificationContext);

  const { currentUser, deleteAccount } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log(currentUser);
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getDocs(
        query(
          collection(Firestore, "exhibits_xx")
          // where("userid", "==", currentUser.uid)
        )
      );
      setIsLoading(false);
      setProjects(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, [currentUser]);

  const onDelete = async (id) => {
    try {
      setIsLoading(true);
      // await deleteProject(id);
      // setProjects(projects.filter((project) => project.id !== id));
      setIsLoading(false);
      notification.success("Project Deleted");
    } catch (error) {
      notification.error("Network Error");
      console.log(error);
    }
  };

  const onEdit = (project) => {
    navigate("/create-project", {
      state: {
        project,
        type: "exhibits",
      },
    });
  };

  const onView = (id) => {
    navigate(`/exhibit/${id}`);
  };
  return (
    <Fragment>
      <div className="card">
        <h1 className="large text-primary">Exhibits</h1>
        <p className="lead">
          <i className="fa fa-user"></i> Welcome {currentUser.displayName}
        </p>
        <div className="profile-edit">
          {/* <Link href="create-profile.html" className="btn btn-light">
                <i className="fas fa-user-circle text-primary"></i> Edit Profile
              </Link> */}
          <Link to="/create-project" className="btn btn-light">
            <i className="fa fa-plus text-primary" aria-hidden="true"></i> Add
            an Exhibit
          </Link>
        </div>
        <h2 className="mt-2 mb-2">Exhbitis</h2>
        {isLoading ? (
          <Fragment>
            <Spinner />
          </Fragment>
        ) : (
          <Fragment>
            {projects.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="hide-sm">Department</th>
                    <th className="hide-sm">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td onClick={() => onView(project.id)}>{project.title}</td>
                      <td onClick={() => onView(project.id)} className="hide-sm">{project.department}</td>
                      <td onClick={() => onView(project.id)} className="hide-sm">{project.status}</td>
                      <td>
                        <div style={{ display: "flex" }}>
                          <button
                            className="btn"
                            onClick={() => onEdit(project)}
                          >
                            <i className="fa fa-marker" aria-hidden="true"></i>
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => onDelete(project.id)}
                          >
                            <i className="fa fa-times" aria-hidden="true"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h2>You have not created any projects yet</h2>
            )}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Exhibits;
