import React, { Fragment, useEffect, useContext, useState } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { Firestore } from "../../config/db";
import { getDocs, collection, query, where } from "firebase/firestore";
import NotificationContext from "../../contexts/alertContext";
import { deleteProject, deleteUserProjects } from "../../models/project";
import { getProjects } from "../../models/project";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const notification = useContext(NotificationContext);

  const { currentUser, deleteAccount } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log(currentUser);
    const fetchData = async () => {
      setIsLoading(true);
      // const data = await getProjects(currentUser.uid);
      const data = await getDocs(
        query(
          collection(Firestore, "projects"),
          where("userid", "==", currentUser.uid)
        )
      );
      setIsLoading(false);
      // if (data.exists()) {
      //   const projectData = data.val();
      //   const projectArray = Object.keys(projectData).map((key) => ({
      //     id: key,
      //     ...projectData[key],
      //   }));
      //   setProjects(projectArray);
      // }
      setProjects(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, [currentUser]);

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
        const id = currentUser.uid;
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
        <h1 className="large text-primary">Control Panel</h1>
        <p className="lead">
          <i className="fa fa-user"></i> Welcome {currentUser.displayName}
        </p>
        <div className="panels">
          <Link to="/exhibits" className="panel">
            <p>
              <i className="fa-regular fa-lightbulb fa-2xl"></i> <br />
              Exhibits
            </p>
          </Link>
          <Link to="/events" className="panel">
            <p>
              <i className="fa-regular fa-clock fa-2xl"></i> <br />
              Events
            </p>
          </Link>
          <Link to="/restrooms" className="panel">
            <p>
              <i className="fa-solid fa-restroom fa-2xl"></i> <br />
              Washrooms
            </p>
          </Link>
          <Link to="/canteens" className="panel">
            <p>
              <i className="fa-solid fa-mug-saucer fa-2xl"></i> <br />
              Canteens
            </p>
          </Link>
        </div>

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
