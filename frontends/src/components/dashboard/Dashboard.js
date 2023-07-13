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

  const {userDetails} = useAuthState();

  // const { userDetails, deleteAccount } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getProjects(userDetails.uid);
      // const data = await getDocs(
      //   query(
      //     collection(Firestore, "projects"),
      //     where("userid", "==", userDetails.uid)
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
  }, [userDetails]);

  const onDelete = async (id) => {
    try {
      setIsLoading(true);
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
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
      },
    });
  };

  const onDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm deletion");
    if (password !== null) {
      try {
        setIsLoading(true);
        const id = userDetails.uid;
        await deleteAccount(password);
        await deleteUserProjects(id);
        setIsLoading(false);
        notification.success("Account Deleted");
      } catch (error) {
        setIsLoading(false);
        notification.error("Invalid Password");
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <div className="card">
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fa fa-user"></i> Welcome {userDetails.displayName}
        </p>
        <div className="profile-edit">
          {/* <Link href="create-profile.html" className="btn btn-light">
                <i className="fas fa-user-circle text-primary"></i> Edit Profile
              </Link> */}
          <Link to="/create-project" className="btn btn-light">
            <i className="fa fa-plus text-primary" aria-hidden="true"></i> Add a
            Project
          </Link>
        </div>
        <h2 className="mt-2 mb-2">Projects</h2>
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
                    <th className="hide-sm">Category</th>
                    <th className="hide-sm">Department</th>
                    <th className="hide-sm">Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td onClick={() => onEdit(project)}>{project.name}</td>
                      <td className="hide-sm" onClick={() => onEdit(project)}>
                        {project.category}
                      </td>
                      <td className="hide-sm" onClick={() => onEdit(project)}>
                        {project.department}
                      </td>
                      <td className="hide-sm" onClick={() => onEdit(project)}>
                        {project.location}
                      </td>
                      <td>
                        <button
                          className="btn btn-delete"
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
          </Fragment>
        )}

        <div className="mt-2">
          <button className="btn btn-primary" onClick={() => onDeleteAccount()}>
            <i className="fas fa-user-minus"></i> Delete My Account
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
