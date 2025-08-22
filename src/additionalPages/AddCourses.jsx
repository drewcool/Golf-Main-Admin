import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "dropify/dist/css/dropify.css";
import $ from "jquery";
import "dropify";
import { addCourseApi } from "../utils/uploadApi"; // Adjust this path as needed

const AddCourse = () => {
    const navigate = useNavigate();
    const [courseForm, setCourseForm] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        description: "",
        holesCount: "",
        facilities: "",
        contact: "",
        image: null,
        gallery: [],
    });

    useEffect(() => {
        $(".dropify").dropify();
        return () => {
            $(".dropify").dropify("destroy");
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "gallery") {
            setCourseForm((prev) => ({ ...prev, gallery: Array.from(files) }));
        } else {
            setCourseForm((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ["name", "address", "city", "state", "description", "holesCount", "facilities", "contact", "image"];
        const isEmptyField = requiredFields.some(field => !courseForm[field]);

        if (isEmptyField) {
            Swal.fire("Missing Fields", "Please fill in all required fields.", "warning");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this course?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Add",
        });

        if (!result.isConfirmed) return;

        const formData = new FormData();
        Object.keys(courseForm).forEach((key) => {
            if (key === "gallery") {
                courseForm.gallery.forEach((file) => formData.append("gallery", file));
            } else {
                formData.append(key, courseForm[key]);
            }
        });

        try {
            const res = await addCourseApi(formData);

            if (res && res.status) {
                await Swal.fire("Success", res.message || "Course added successfully!", "success");

                // Ask if user wants to setup holes
                const setupHoles = await Swal.fire({
                    title: "Setup Holes?",
                    text: "Would you like to setup holes for this course now?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Setup Holes",
                    cancelButtonText: "No, Later"
                });

                if (setupHoles.isConfirmed) {
                    // Navigate to hole setup with course details
                    navigate("/courses/hole-setup", {
                        state: {
                            courseId: res.courseId || res.course?._id,
                            courseName: courseForm.name,
                            holesCount: parseInt(courseForm.holesCount) || 18
                        }
                    });
                } else {
                    // Reset form
                    setCourseForm({
                        name: "",
                        address: "",
                        city: "",
                        state: "",
                        description: "",
                        holesCount: "",
                        facilities: "",
                        contact: "",
                        image: null,
                        gallery: [],
                    });

                    $(".dropify").dropify(); // re-init dropify
                }
            } else {
                throw new Error(res?.message || "Unexpected response format");
            }
        } catch (err) {
            console.error("Course submission error:", err);
            Swal.fire("Error", err?.message || "Something went wrong", "error");
        }
    };

    return (
        <main className="app-content">
            <div className="app-title tile p-3">
                <h1><span className="mr-4 fw-bold">Add Course</span></h1>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="tile">
                        <div className="case-status d-flex justify-content-center" style={{ backgroundColor: "#00489d", color: "#fff", height: "50px" }}>
                            <h4 className="mt-2">Add New Course</h4>
                        </div>
                        <div className="tile-body p-3">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {["name", "address", "city", "state", "holesCount", "facilities", "contact"].map((field) => (
                                    <div className="mb-3" key={field}>
                                        <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name={field}
                                            value={courseForm[field]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ))}

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={courseForm.description}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Main Image</label>
                                    <input
                                        type="file"
                                        className="dropify"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Gallery Images</label>
                                    <input
                                        type="file"
                                        className="dropify"
                                        name="gallery"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Add Course</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddCourse;
