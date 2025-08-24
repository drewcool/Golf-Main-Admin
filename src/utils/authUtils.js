import axios from "axios";

const userExists = localStorage.getItem("admin");
const authTokenExist = localStorage.getItem("authToken");
const API_URL = `http://13.51.189.31:5001/api`

export const getAllServices = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        const response = await axios.get(`${API_URL}/service/get-all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error.message || error);
        throw error;
    }
};

export const createServices = async () => {
    try {
        if (!authTokenExist) {
            throw new Error("User token is missing. Please log in.");
        }
        console.log("auth", authTokenExist)

        const response = await axios.post(
            `${API_URL}/service/add-new`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${authTokenExist}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error.message || error);
        throw error;
    }
};

export const getAllDashboard = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        const response = await axios.get(`${API_URL}/admin/dashboard-data`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error.message || error);
        throw error;
    }
};

export const getAllProviders = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        const response = await axios.get(`${API_URL}/service-provider/get-all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error.message || error);
        throw error;
    }
};

export const getUserList000 = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        if (!authTokenExist) {
            throw new Error("Auth token does not exist in localStorage.");
        }

        const response = await axios.get(`${API_URL}/user/user-list`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching user list:", error.message || error);
        throw error;
    }
};

export const deleteUser = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        if (!authTokenExist) {
            throw new Error("Auth token does not exist in localStorage.");
        }

        const response = await axios.get(`${API_URL}/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching user list:", error.message || error);
        throw error;
    }
};

export const addServiceRequest = async (data) => {
    const authToken = localStorage.getItem("authToken"); 
    if (!authToken) {
        console.error("Authorization token is missing.");
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/service/add-new`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`, 
            }
        });

        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding service request:", error.response?.data || error.message);
        throw error; 
    }
};
