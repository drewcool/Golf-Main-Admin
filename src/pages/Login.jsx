import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/dsa.png";
import videobg from "../assets/images/videoplayback.mp4";
import axios from "axios";
import { getUserLogin } from "../utils/api";

const Login = () => {

  //
  const fetchUserData = async () => {
    try {
      const response = await axios.post('https://admin.astropush.com/user_api/getuser');
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  useEffect(() => {
    fetchUserData();

    const intervalId = setInterval(() => {
      fetchUserData();
    }, 30000); 

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  //
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isAlertVisible) {
      const timer = setTimeout(() => setIsAlertVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAlertVisible]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setError("");
    console.log("Formdata", formData)
    if (email.length === 0) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (password.length === 0) {
      setPasswordError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const loginResponse = await getUserLogin(formData);
      console.log("loginResponse" , loginResponse);
      
      if (loginResponse) {
        localStorage.setItem("authToken", loginResponse.data.token);
        localStorage.setItem("admin", JSON.stringify(loginResponse.admin));
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-img">
      <video className="video-background" muted loop autoPlay>
        <source src={videobg} type="video/mp4" />
      </video>
      <section className="login-content">
        <div className="row">
          <div className="col-lg-8 offset-lg-4">
            <div className="login-box">
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="logo mx-auto text-center">
                  {/* <img style={{ height: "60px" }} src={logo} alt="Logo" /> */}
                  <h1>RED GOLF</h1>
                </div>
                <div className="mb-3">
                  <label className="text-white">Email</label>
                  <input
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                    name="email"
                    autoFocus
                  />
                  {emailError && <small className="text-danger">{emailError}</small>}
                </div>
                <div className="mb-3">
                  <label className="text-white" htmlFor="password">Password</label>
                  <input
                    className={`form-control ${passwordError ? "is-invalid" : ""}`}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    name="password"
                  />
                  {passwordError && <small className="text-danger">{passwordError}</small>}
                </div>
                <div className="mt-4 btn-container d-grid">
                  <button
                    type="submit"
                    className="btn btn-dark custom-btn btn-block"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-box-arrow-in-right me-2 fs-5"></i>
                    )}
                    {loading ? " Signing In..." : "SIGN IN"}
                  </button>
                </div>
                {isAlertVisible && (
                  <div className="alert alert-dismissible alert-danger p-0">
                    <strong>{error}</strong>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
