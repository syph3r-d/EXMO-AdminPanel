import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

axios.defaults.baseURL = "http://localhost:8000/";

export async function loginUser(dispatch, loginPayload) {
  const requestOptions = {
    headers: { "Content-Type": "application/json" },
  };

  const body = JSON.stringify(loginPayload);
  console.log(body);

  try {
    dispatch({ type: "REQUEST_LOGIN" });
    let response = await axios.post("/login", body, requestOptions);
    let data = response.data;

    if (data) {
      setAuthToken(data);
      getUser(dispatch, data);
      return data;
    }

    dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
  }
}

export async function getUser(dispatch, token) {
  try {
    const response = await axios.get("/me");
    const data = response.data;
    console.log(data);
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
  } catch (err) {
    console.log(err);
  }
}

export async function logout(dispatch) {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
}
