import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "dropify/dist/css/dropify.css";
import $ from "jquery";
import "dropify";
import { updateCourseApi } from "../utils/uploadApi";
import { mediaUrl } from "../utils/URL";

const EditCourse = () => {
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const course = state?.course;

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

  const [loading, setLoading] = useState(false);

  // Tee details state (mirror AddCourses)
  const defaultTees = [
    { label: "Man", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
    { label: "Woman", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
    { label: "Champion", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
    { label: "Pro", enabled: false, color: "", colorCode: "", distanceInYards: "", manScore: "", womanScore: "", championScore: "", proScore: "", par: "" },
  ];
  const [teeDetails, setTeeDetails] = useState(defaultTees);

  useEffect(() => {
    if (course) {
      setCourseForm({
        name: course.name || "",
        address: course.address || "",
        city: course.city || "",
        state: course.state || "",
        description: course.description || "",
        holesCount: course.holesCount || "",
        facilities: Array.isArray(course.facilities) ? course.facilities.join(", ") : course.facilities || "",
        contact: course.contact?.phone || "",
        image: null,
        gallery: [],
      });
      // Seed teeDetails from course if available
      if (Array.isArray(course.teeDetails) && course.teeDetails.length > 0) {
        const seeded = course.teeDetails.map((t) => ({
          label: t.label || t.color || "Tee",
          enabled: true,
          color: t.color || "",
          colorCode: t.colorCode || "",
          distanceInYards: t.distanceInYards ?? "",
          manScore: t.manScore ?? "",
          womanScore: t.womanScore ?? "",
          championScore: t.championScore ?? "",
          proScore: t.proScore ?? "",
          par: t.par ?? "",
        }));
        setTeeDetails(seeded);
      }
    }

    $(".dropify").dropify();
    return () => {
      $(".dropify").dropify("destroy");
    };
  }, [course]);

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

    const requiredFields = ["name", "address", "city", "state", "description", "holesCount", "facilities", "contact"];
    const isEmptyField = requiredFields.some(field => !courseForm[field]);

    if (isEmptyField) {
      Swal.fire("Missing Fields", "Please fill in all required fields.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this course?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add course ID for update
      formData.append("courseId", course._id);
      
      Object.keys(courseForm).forEach((key) => {
        if (key === "gallery") {
          courseForm.gallery.forEach((file) => formData.append("gallery", file));
        } else if (key === "image" && courseForm.image) {
          formData.append(key, courseForm[key]);
        } else if (key !== "image") {
          formData.append(key, courseForm[key]);
        }
      });

      // Append teeDetails
      const enabledTees = teeDetails
        .filter(t => t.enabled)
        .map(t => ({
          color: t.color,
          colorCode: t.colorCode,
          distanceInYards: t.distanceInYards !== "" ? Number(t.distanceInYards) : undefined,
          manScore: t.manScore !== "" ? Number(t.manScore) : undefined,
          womanScore: t.womanScore !== "" ? Number(t.womanScore) : undefined,
          championScore: t.championScore !== "" ? Number(t.championScore) : undefined,
          proScore: t.proScore !== "" ? Number(t.proScore) : undefined,
          par: t.par !== "" ? Number(t.par) : undefined,
        }));
      formData.append("teeDetails", JSON.stringify(enabledTees));

      const res = await updateCourseApi(formData);

      if (res && res.status) {
        await Swal.fire("Success", res.message || "Course updated successfully!", "success");
        
        // Navigate back to course details
        navigate("/courses/view-details", {
          state: { 
            course: { 
              ...course, 
              ...courseForm,
              facilities: courseForm.facilities.split(", ").filter(f => f.trim()),
              contact: { phone: courseForm.contact }
            } 
          }
        });
      } else {
        throw new Error(res?.message || "Unexpected response format");
      }
    } catch (err) {
      console.error("Course update error:", err);
      Swal.fire("Error", err?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <main className="app-content">
        <div className="app-title tile p-3">
          <h1><span className="mr-4 fw-bold">Edit Course</span></h1>
          <div className="alert alert-warning mt-2" role="alert">
            <strong>⚠️ Warning:</strong> No course data found. Please go back and select a course.
          </div>
          <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <h1><span className="mr-4 fw-bold">Edit Course — {course.name}</span></h1>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="tile">
            <div className="case-status d-flex justify-content-center" style={{ backgroundColor: "#00489d", color: "#fff", height: "50px" }}>
              <h4 className="mt-2">Edit Course</h4>
            </div>
            
            <div className="tile-body p-3">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {["name", "address", "city", "state", "holesCount", "facilities", "contact"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {field === "holesCount" && " (Number of holes)"}
                      {field === "facilities" && " (comma-separated)"}
                      {field === "contact" && " (Phone number)"}
                    </label>
                    <input
                      type={field === "holesCount" ? "number" : "text"}
                      className="form-control"
                      name={field}
                      value={courseForm[field]}
                      onChange={handleChange}
                      min={field === "holesCount" ? "1" : undefined}
                      max={field === "holesCount" ? "36" : undefined}
                    />
                  </div>
                ))}

                {/* Tee Details editor */}
                <div className="mb-4">
                  <label className="form-label d-flex align-items-center justify-content-between">
                    <span className="fw-bold">Tee Details</span>
                  </label>
                  {teeDetails.map((tee, idx) => (
                    <div key={idx} className="border rounded p-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <input className="form-check-input me-2" type="checkbox" id={`tee-enabled-${idx}`} checked={tee.enabled} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, enabled: e.target.checked } : t))} />
                          <input type="text" className="form-control form-control-sm" style={{ maxWidth: 220 }} value={tee.label} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, label: e.target.value } : t))} placeholder="Tee name" />
                        </div>
                      </div>
                      {tee.enabled && (
                        <div className="row g-3">
                          <div className="col-md-2">
                            <label className="form-label">Color</label>
                            <select className="form-select" value={tee.color} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, color: e.target.value } : t))}>
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
                            <input type="text" className="form-control" placeholder="#RRGGBB" value={tee.colorCode} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, colorCode: e.target.value } : t))} />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Distance (yards)</label>
                            <input type="number" className="form-control" value={tee.distanceInYards} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, distanceInYards: e.target.value } : t))} />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Par</label>
                            <input type="number" className="form-control" value={tee.par} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, par: e.target.value } : t))} />
                          </div>
                          {tee.label.toLowerCase() === 'man' && (
                            <div className="col-md-2">
                              <label className="form-label">Man Score</label>
                              <input type="number" className="form-control" value={tee.manScore} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, manScore: e.target.value } : t))} />
                            </div>
                          )}
                          {tee.label.toLowerCase() === 'woman' && (
                            <div className="col-md-2">
                              <label className="form-label">Woman Score</label>
                              <input type="number" className="form-control" value={tee.womanScore} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, womanScore: e.target.value } : t))} />
                            </div>
                          )}
                          {tee.label.toLowerCase() === 'champion' && (
                            <div className="col-md-2">
                              <label className="form-label">Champion Score</label>
                              <input type="number" className="form-control" value={tee.championScore} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, championScore: e.target.value } : t))} />
                            </div>
                          )}
                          {tee.label.toLowerCase() === 'pro' && (
                            <div className="col-md-2">
                              <label className="form-label">Pro Score</label>
                              <input type="number" className="form-control" value={tee.proScore} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, proScore: e.target.value } : t))} />
                            </div>
                          )}
                          {!(['man','woman','champion','pro'].includes(tee.label.toLowerCase())) && (
                            <>
                              <div className="col-md-2">
                                <label className="form-label">Champion Score</label>
                                <input type="number" className="form-control" value={tee.championScore} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, championScore: e.target.value } : t))} />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Pro Score</label>
                                <input type="number" className="form-control" value={tee.proScore} onChange={(e) => setTeeDetails(prev => prev.map((t,i) => i===idx ? { ...t, proScore: e.target.value } : t))} />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

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
                  <p className="text-muted small">Leave empty to keep current image</p>
                  <input
                    type="file"
                    className="dropify"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                                     {course.image && (
                     <div className="mt-2">
                       <small className="text-muted">Current image:</small>
                       <img
                         src={mediaUrl() + course.image}
                         alt="Current"
                         className="d-block mt-1"
                         style={{ maxHeight: "100px", maxWidth: "200px" }}
                       />
                     </div>
                   )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Gallery Images</label>
                  <p className="text-muted small">Leave empty to keep current gallery</p>
                  <input
                    type="file"
                    className="dropify"
                    name="gallery"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                                     {course.gallery && course.gallery.length > 0 && (
                     <div className="mt-2">
                       <small className="text-muted">Current gallery:</small>
                       <div className="row mt-1">
                         {course.gallery.map((img, index) => (
                           <div className="col-2 mb-2" key={index}>
                             <img
                               src={mediaUrl() + img}
                               alt={`Gallery ${index + 1}`}
                               className="img-fluid rounded"
                               style={{ height: "80px", width: "100%", objectFit: "cover" }}
                             />
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Course"}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditCourse;
