import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "dropify/dist/css/dropify.css";
import $ from "jquery";
import "dropify";
import { addLessonApi } from "../utils/uploadApi";

const AddLesson = () => {
    const [lessonForm, setLessonForm] = useState({
        title: "",
        description: "",
        thumbnail: null,
        video: null,
    });

    useEffect(() => {
        $(".dropify").dropify();
        return () => {
            $(".dropify").dropify("destroy");
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLessonForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setLessonForm((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!lessonForm.title || !lessonForm.description || !lessonForm.thumbnail || !lessonForm.video) {
            Swal.fire("Missing Fields", "Please fill in all fields.", "warning");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this lesson?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Add",
        });

        if (!result.isConfirmed) return;

        const formData = new FormData();
        formData.append("title", lessonForm.title);
        formData.append("description", lessonForm.description);
        formData.append("thumbnail", lessonForm.thumbnail);
        formData.append("video", lessonForm.video);

        try {
            const res = await addLessonApi(formData);
          
            if (res && res.status) {
              await Swal.fire("Success", res.message || "Lesson added successfully!", "success");
              
              // Reset the form
              setLessonForm({
                title: "",
                description: "",
                thumbnail: null,
                video: null,
              });
          
              // Re-init Dropify after reset
              $(".dropify").dropify();
            } else {
              throw new Error(res?.message || "Unexpected response format");
            }
          } catch (err) {
            console.error("Lesson submission error:", err);
            Swal.fire("Error", err?.message || "Something went wrong", "error");
          }
    };

    return (
        <main className="app-content">
            <div className="app-title tile p-3">
                <h1><span className="mr-4 fw-bold">Add Lesson</span></h1>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="tile">
                        <div
                            className="case-status d-flex justify-content-center"
                            style={{ backgroundColor: "#00489d", color: "#fff", height: "50px" }}
                        >
                            <h4 className="mt-2">Add New Lesson</h4>
                        </div>
                        <div className="tile-body p-3">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={lessonForm.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={lessonForm.description}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Thumbnail (Image)</label>
                                    <input
                                        type="file"
                                        className="dropify"
                                        name="thumbnail"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Video</label>
                                    <input
                                        type="file"
                                        className="dropify"
                                        name="video"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Add Lesson</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddLesson;
