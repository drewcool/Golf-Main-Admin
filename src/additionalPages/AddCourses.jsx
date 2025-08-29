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

    // Tee details UI state
    const defaultTees = [
        { label: "Man", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
        { label: "Woman", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
        { label: "Champion", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
        { label: "Pro", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
    ];
    const [teeDetails, setTeeDetails] = useState(defaultTees);

    const addMoreTee = async () => {
        const { value: teeName } = await Swal.fire({
            title: "Add Tee",
            input: "text",
            inputLabel: "Tee name",
            inputPlaceholder: "Enter tee name (e.g., Senior)",
            showCancelButton: true,
            confirmButtonText: "Add"
        });
        if (!teeName) return;
        setTeeDetails((prev) => ([...prev, { label: teeName, enabled: true, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" }]));
    };

    const updateTee = (index, field, value) => {
        setTeeDetails((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const removeTee = (index) => {
        setTeeDetails((prev) => prev.filter((_, i) => i !== index));
    };

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

        // Build teeDetails payload: include only enabled tees
        const enabledTees = teeDetails
            .filter(t => t.enabled)
            .map(t => ({
                color: t.color,
                colorCode: t.colorCode,
                distanceInYards: Number(t.distanceInYards) || 0,
                manScore: t.manScore !== "" ? Number(t.manScore) : undefined,
                womanScore: t.womanScore !== "" ? Number(t.womanScore) : undefined,
                championScore: t.championScore !== "" ? Number(t.championScore) : undefined,
                proScore: t.proScore !== "" ? Number(t.proScore) : undefined,
                par: t.par !== "" ? Number(t.par) : undefined,
            }));
        formData.append("teeDetails", JSON.stringify(enabledTees));

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

                                {/* Tee Details Section */}
                                <div className="mb-4">
                                    <label className="form-label d-flex align-items-center justify-content-between">
                                        <span className="fw-bold">Tee Details</span>
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={addMoreTee}>+ Add Tee</button>
                                    </label>
                                    {teeDetails.map((tee, idx) => (
                                        <div key={idx} className="border rounded p-3 mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <input className="form-check-input me-2" type="checkbox" id={`tee-enabled-${idx}`} checked={tee.enabled} onChange={(e) => updateTee(idx, 'enabled', e.target.checked)} />
                                                    <input type="text" className="form-control form-control-sm" style={{ maxWidth: 220 }} value={tee.label} onChange={(e) => updateTee(idx, 'label', e.target.value)} placeholder="Tee name" />
                                                </div>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeTee(idx)}>Remove</button>
                                            </div>
                                            {tee.enabled && (
                                                <div className="row g-3">
                                                    <div className="col-md-2">
                                                        <label className="form-label">Color</label>
                                                        <select className="form-select" value={tee.color} onChange={(e) => updateTee(idx, 'color', e.target.value)}>
                                                            <option value="">Select</option>
                                                            <option value="red">Red</option>
                                                            <option value="blue">Blue</option>
                                                            <option value="white">White</option>
                                                            <option value="black">Black</option>
                                                            <option value="gold">Gold</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label">Hex</label>
                                                        <input type="text" className="form-control" placeholder="#RRGGBB" value={tee.colorCode} onChange={(e) => updateTee(idx, 'colorCode', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label">Distance (yards)</label>
                                                        <input type="number" className="form-control" value={tee.distanceInYards} onChange={(e) => updateTee(idx, 'distanceInYards', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label">Par</label>
                                                        <input type="number" className="form-control" value={tee.par} onChange={(e) => updateTee(idx, 'par', e.target.value)} />
                                                    </div>
                                                    {tee.label.toLowerCase() === 'man' && (
                                                        <div className="col-md-2">
                                                            <label className="form-label">Man Score</label>
                                                            <input type="number" className="form-control" value={tee.manScore} onChange={(e) => updateTee(idx, 'manScore', e.target.value)} />
                                                        </div>
                                                    )}
                                                    {tee.label.toLowerCase() === 'woman' && (
                                                        <div className="col-md-2">
                                                            <label className="form-label">Woman Score</label>
                                                            <input type="number" className="form-control" value={tee.womanScore} onChange={(e) => updateTee(idx, 'womanScore', e.target.value)} />
                                                        </div>
                                                    )}
                                                    {tee.label.toLowerCase() === 'champion' && (
                                                        <div className="col-md-2">
                                                            <label className="form-label">Champion Score</label>
                                                            <input type="number" className="form-control" value={tee.championScore} onChange={(e) => updateTee(idx, 'championScore', e.target.value)} />
                                                        </div>
                                                    )}
                                                    {tee.label.toLowerCase() === 'pro' && (
                                                        <div className="col-md-2">
                                                            <label className="form-label">Pro Score</label>
                                                            <input type="number" className="form-control" value={tee.proScore} onChange={(e) => updateTee(idx, 'proScore', e.target.value)} />
                                                        </div>
                                                    )}
                                                    {!(['man','woman','champion','pro'].includes(tee.label.toLowerCase())) && (
                                                        <>
                                                            <div className="col-md-2">
                                                                <label className="form-label">Champion Score</label>
                                                                <input type="number" className="form-control" value={tee.championScore} onChange={(e) => updateTee(idx, 'championScore', e.target.value)} />
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="form-label">Pro Score</label>
                                                                <input type="number" className="form-control" value={tee.proScore} onChange={(e) => updateTee(idx, 'proScore', e.target.value)} />
                                                            </div>
                                                        </>
                                                    )}
                                                    {/* sId input removed */}
                                                </div>
                                            )}
                                        </div>
                                    ))}
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
