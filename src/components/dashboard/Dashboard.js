import React, { Fragment, useEffect, useContext, useState } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { Firestore } from "../../config/db";
import { getDocs, collection, query, where } from "firebase/firestore";
import NotificationContext from "../../contexts/alertContext";
import { deleteProject, deleteUserProjects } from "../../models/project2";
import { getProjects } from "../../models/project2";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const notification = useContext(NotificationContext);

  const { currentUser, deleteAccount } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data=await getProjects(currentUser.uid)
      // const data = await getDocs(
      //   query(
      //     collection(Firestore, "projects"),
      //     where("userid", "==", currentUser.uid)
      //   )
      // );
      setIsLoading(false);
      if (data.exists()) {
        const projectData = data.val();
        const projectArray = Object.keys(projectData).map((key) => ({
          id: key,
          ...projectData[key],
        }));
        setProjects(projectArray);
      }
      // setProjects(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, [currentUser]);

  const onDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
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
      },
    });
  };

  const onDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm deletion");
    if (password !== null) {
      try {
        setIsLoading(true);
        await deleteUserProjects(currentUser.uid);
        await deleteAccount(password);
        setIsLoading(false);
        notification.success("Account Deleted");
      } catch (error) {
        notification.error("Network Error");
        console.log(error);
      }
    }
  };


  return (
    <Fragment>
      {isLoading ? (
        <Fragment>
          <div className="alert-display">
            <Spinner />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="card">
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
              <i className="fa fa-user"></i> Welcome {currentUser.displayName}
            </p>
            <div className="profile-edit">
              <Link href="create-profile.html" className="btn btn-light">
                <i className="fas fa-user-circle text-primary"></i> Edit Profile
              </Link>
              <Link to="/create-project" className="btn btn-light">
                <i className="fa fa-plus text-primary" aria-hidden="true"></i>{" "}
                Add a Project
              </Link>
            </div>
            <h2 className="mt-2 mb-2">Projects</h2>
            {projects.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="hide-sm">Category</th>
                    <th className="hide-sm">Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td className="hide-sm">{project.category}</td>
                      <td className="hide-sm">{project.location}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => onEdit(project)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => onDelete(project.id)}
                        >
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h2>You have not created any projects yet</h2>
            )}

            <div className="mt-2">
              <button
                className="btn btn-primary"
                onClick={() => onDeleteAccount()}
              >
                <i className="fas fa-user-minus"></i> Delete My Account
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Dashboard;
