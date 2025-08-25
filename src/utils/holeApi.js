import axios from 'axios';

const token = localStorage.getItem("authToken");
const API_URL = `https://golfserver.appsxperts.live/api`;
// const API_URL = `http://13.51.189.31:5001/api`;
// const API_URL = `http://localhost:5001/api`;


// Save holes for a course
export const saveCourseHoles = async (courseId, holes) => {
  try {
    const res = await axios.post(`${API_URL}/golf/saveHoles`, {
      courseId,
      holes
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.data.status) {
      console.log("Holes saved:", res.data);
      return res.data;
    } else {
      throw new Error(res.data.message || "Failed to save holes");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save holes');
  }
};

// Get holes for a course
export const getCourseHoles = async (courseId) => {
  try {
    const res = await axios.get(`${API_URL}/golf/getHoles/${courseId}`, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    });

    if (res.data.status) {
      console.log("Holes retrieved:", res.data);
      return res.data;
    } else {
      throw new Error(res.data.message || "Failed to get holes");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get holes');
  }
};

// Delete holes for a course
export const deleteCourseHoles = async (courseId) => {
  try {
    const res = await axios.delete(`${API_URL}/golf/deleteHoles/${courseId}`, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    });

    if (res.data.status) {
      console.log("Holes deleted:", res.data);
      return res.data;
    } else {
      throw new Error(res.data.message || "Failed to delete holes");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete holes');
  }
};
