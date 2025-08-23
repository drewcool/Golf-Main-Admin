import axios from "axios";

const userExists = localStorage.getItem("admin");
const authTokenExist = localStorage.getItem("authToken");
// const API_URL = `http://localhost:7500/api`
// const API_URL = `http://157.173.222.27:7500/api`
  const API_URL = `http://13.51.189.31:5000/api`
// const API_URL = `https://golfserver.appsxperts.live/api`

export const getUserLogin = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/user/login`, data);
      if (res.data.status) {
        console.log("Response Login", res)
        return res.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed.");
    }
  };

export const getUserList = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        if (!authTokenExist) {
            throw new Error("Auth token does not exist in localStorage.");
        }

        const response = await axios.get(`${API_URL}/admin/getUsersList`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user list:", error.message || error);
        throw error;
    }
};


export const getClubList = async () => {
    try {

console.log("authTokenExist" , authTokenExist);

        const response = await axios.get(`${API_URL}/admin/get-clubs`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user list:", error.message || error);
        throw error;
    }
};

export const getGolfCoursesList = async () => {
    try {

        console.log("authTokenExist cc" , authTokenExist);
        const response = await axios.get(`${API_URL}/admin/getGolfCourses`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.courses;
    } catch (error) {
        console.error("Error fetching user list:", error.message || error);
        throw error;
    }
};
export const getLessionsList = async () => {
    try {
        const response = await axios.get(`${API_URL}/lession/get-lessions`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        console.log("response inside api" , response);
        
        return response.data;
    } catch (error) {
        console.error("Error fetching user list:", error.message || error);
        throw error;
    }
};


