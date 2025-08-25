import axios from "axios";

const token = localStorage.getItem("authToken");
const authTokenExist = localStorage.getItem("authToken");
// const API_URL = `http://localhost:7500/api` 
// const API_URL = `http://157.173.222.27:7500/api`
// const API_URL = `http://13.51.189.31:5001/api`
const API_URL = `https://golfserver.appsxperts.live/api`



// Makeable
export const addMakeableAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-makeable`, data, {
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
export const getMakeableAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/makeable`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};



// upload-chipping-drill-fairway
export const addUploadChippingDrillFairwayAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-chipping-drill-fairway`, data, {
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
export const getUploadChippingDrillFairwayAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/chipping-drill-fairway`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};







// upload-Survivor
export const addUploadChippingDrillRoughAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-chipping-drill-rough`, data, {
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
export const getUploadChippingDrillRoughAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/chipping-drill-rough`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};




// upload-chipping-drill-rough
export const addUploadSurvivorAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-survivor`, data, {
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
export const getUploadSurvivorAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/survivor`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};



// upload-chipping-drill-rough
export const addUploadDriverTestAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-driver-test`, data, {
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
export const getUploadDriverTestAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/driver-test`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};



// upload-chipping-drill-rough
export const addUploadApproachAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-approach`, data, {
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
export const getUploadApproachAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/approach`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};



// upload-ApproachVariable
export const addUploadApproachVariableAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-approach-variable`, data, {
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
export const getUploadApproachVariableAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/approach-variable`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};




// upload-ApproachVariable
export const addLagPuttAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-lag-putt`, data, {
        headers: { 
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
           },
      });
  
      console.log("Lesson Added:ee", res.data);
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
export const getLagPuttAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/lag-putt-admin`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};






// upload-ApproachVariable
export const addStrokeTestAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-stroke-test`, data, {
        headers: { 
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
           },
      });
  
      console.log("Lesson Added:ee", res.data);
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
export const getStrokeTestAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/stroke-test`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};






// upload-Simulated Round
export const addSimulatedRoundAPI = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/practice/upload-simulated-round`, data, {
        headers: { 
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
           },
      });
  
      console.log("Lesson Added:ee", res.data);
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
export const getSimulatedRoundAPI = async () => {
    try {
      const res = await axios.get(`${API_URL}/practice/simulated-round`, {
        headers: { 
           Authorization: `Bearer ${token}`
           },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
};





