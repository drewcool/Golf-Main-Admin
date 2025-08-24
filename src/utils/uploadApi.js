import axios from "axios";

const token = localStorage.getItem("authToken");
const userExists = localStorage.getItem("admin");
const authTokenExist = localStorage.getItem("authToken");
// const API_URL = `http://localhost:7500/api`
// const API_URL = `http://157.173.222.27:7500/api`
// const API_URL = `https://golfserver.appsxperts.live/api`
const API_URL = `http://13.51.189.31:5000/api`

export const addLessonApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/lession/add-lession`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

export const addCourseApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/golf/addCourse`, data, {
        headers: { 
           "Content-Type": "multipart/form-data"
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

  export const DeleteGolfCourseApi = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/delete-GolfCourse/${id}`, {
        headers: { 
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "delete failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "delete failed.");
    }
  };

export const AddClubApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/admin/addClub`, data, {
        headers: { 
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };
export const UpdateClubApi = async (data, id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/update-club/${id}`, {
        headers: { 
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };
  
export const DeleteClubApi = async ( id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/delete-clubs/${id}`, {
        headers: { 
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

export const DeleteLessionApi = async ( id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/deleteLession/${id}`, {
        headers: { 
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

export const updateCourseApi = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/golf/updateCourse`, data, {
        headers: { 
           "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Course Updated:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Course update failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Course update failed.");
    }
  };

export const getCourseByIdApi = async (courseId) => {
    try {
      const res = await axios.get(`${API_URL}/golf/getCourse/${courseId}`, {
        headers: { 
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Course Retrieved:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Course retrieval failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Course retrieval failed.");
    }
  };



