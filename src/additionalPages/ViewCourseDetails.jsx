import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCourseHoles } from "../utils/holeApi";
import { getCourseByIdApi } from "../utils/uploadApi";
import { mediaUrl } from "../utils/URL";
import Swal from "sweetalert2";

const ViewCourseDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const course = state?.course;
  const [holes, setHoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course?._id) {
      loadHoles();
      loadCourseDetails();
    }
  }, [course]);

  const loadHoles = async () => {
    try {
      const response = await getCourseHoles(course._id);
      if (response.status && response.data.holes.length > 0) {
        setHoles(response.data.holes);
      }
    } catch (error) {
      console.error("Error loading holes:", error);
    }
  };

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await getCourseByIdApi(course._id);
      if (response.status && response.data.course) {
        // Update course data if needed
        console.log("Course details loaded:", response.data.course);
      }
    } catch (error) {
      console.error("Error loading course details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <main className="app-content">
        <div className="app-title tile p-3">
          <h1><span className="mr-4 fw-bold">Course Details</span></h1>
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
        <h1><span className="mr-4 fw-bold">Course Details — {course.name}</span></h1>
        <div className="d-flex gap-2 mt-2">
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/courses/hole-setup", {
              state: {
                courseId: course._id,
                courseName: course.name,
                holesCount: course.holesCount || 18
              }
            })}
          >
            <i className="fa fa-flag me-2"></i>
            Manage Holes
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => navigate("/courses/edit-course", {
              state: { course }
            })}
          >
            <i className="fa fa-edit me-2"></i>
            Edit Course
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          {/* Course Information */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header" style={{ background: "#00489d", color: "#fff" }}>
                <h5 className="mb-0">Course Information</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-sm-4"><strong>Name:</strong></div>
                  <div className="col-sm-8">{course.name}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4"><strong>Address:</strong></div>
                  <div className="col-sm-8">{course.address}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4"><strong>City:</strong></div>
                  <div className="col-sm-8">{course.city}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4"><strong>State:</strong></div>
                  <div className="col-sm-8">{course.state}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4"><strong>Holes:</strong></div>
                  <div className="col-sm-8">{course.holesCount}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4"><strong>Description:</strong></div>
                  <div className="col-sm-8">{course.description}</div>
                </div>
                {course.contact && (
                  <>
                    <div className="row mb-3">
                      <div className="col-sm-4"><strong>Phone:</strong></div>
                      <div className="col-sm-8">{course.contact.phone}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4"><strong>Email:</strong></div>
                      <div className="col-sm-8">{course.contact.email}</div>
                    </div>
                    {course.contact.website && (
                      <div className="row mb-3">
                        <div className="col-sm-4"><strong>Website:</strong></div>
                        <div className="col-sm-8">
                          <a href={course.contact.website} target="_blank" rel="noopener noreferrer">
                            {course.contact.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {course.facilities && course.facilities.length > 0 && (
                  <div className="row mb-3">
                    <div className="col-sm-4"><strong>Facilities:</strong></div>
                    <div className="col-sm-8">
                      {Array.isArray(course.facilities) 
                        ? course.facilities.join(", ")
                        : course.facilities
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Images */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header" style={{ background: "#00489d", color: "#fff" }}>
                <h5 className="mb-0">Course Images</h5>
              </div>
              <div className="card-body">
                {course.image && (
                  <div className="mb-3">
                    <strong>Main Image:</strong>
                    <div className="mt-2">
                      <img
                        src={mediaUrl() + course.image}
                        alt="Main"
                        className="img-fluid rounded"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  </div>
                )}
                
                {course.gallery && course.gallery.length > 0 && (
                  <div>
                    <strong>Gallery:</strong>
                    <div className="row mt-2">
                      {course.gallery.map((img, index) => (
                        <div className="col-4 mb-2" key={index}>
                          <img
                            src={mediaUrl() + img}
                            alt={`Gallery ${index + 1}`}
                            className="img-fluid rounded"
                            style={{ height: "100px", width: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Holes Information */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#00489d", color: "#fff" }}>
                <h5 className="mb-0">Holes Information</h5>
                {loading && (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
              <div className="card-body">
                {holes.length > 0 ? (
                  <div className="row">
                    {holes.map((hole, index) => (
                      <div className="col-md-6 mb-3" key={index}>
                        <div className="border rounded p-3">
                          <h6 className="mb-2">Hole {hole.hole} - Par {hole.par}</h6>
                          
                          {/* Tee Boxes */}
                          {hole.teeBoxes && hole.teeBoxes.length > 0 && (
                            <div className="mb-2">
                              <strong>Tee Boxes:</strong>
                              <div className="table-responsive">
                                <table className="table table-sm table-bordered mt-2">
                                  <thead>
                                    <tr>
                                      <th>Tee Type</th>
                                      <th>Color</th>
                                      <th>Par</th>
                                      <th>Yards</th>
                                      <th>Meters</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {hole.teeBoxes.map((tee, teeIndex) => (
                                      <tr key={teeIndex}>
                                        <td>{tee.teeType}</td>
                                        <td>
                                          <span 
                                            className="badge" 
                                            style={{ 
                                              backgroundColor: tee.hex || '#000000',
                                              color: '#fff'
                                            }}
                                          >
                                            {tee.color}
                                          </span>
                                        </td>
                                        <td>{tee.par}</td>
                                        <td>{tee.yards}</td>
                                        <td>{tee.meters}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Course Features */}
                          <div className="row">
                            {hole.green?.enabled && (
                              <div className="col-6">
                                <small className="text-success">
                                  <i className="fa fa-circle me-1"></i>Green
                                </small>
                              </div>
                            )}
                            {hole.waterHazard?.enabled && (
                              <div className="col-6">
                                <small className="text-info">
                                  <i className="fa fa-tint me-1"></i>Water Hazard
                                </small>
                              </div>
                            )}
                            {hole.sandBunker?.enabled && (
                              <div className="col-6">
                                <small className="text-warning">
                                  <i className="fa fa-circle me-1"></i>Sand Bunker
                                </small>
                              </div>
                            )}
                            {hole.fairway?.enabled && (
                              <div className="col-6">
                                <small className="text-success">
                                  <i className="fa fa-leaf me-1"></i>Fairway
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No holes configured for this course yet.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate("/courses/hole-setup", {
                        state: {
                          courseId: course._id,
                          courseName: course.name,
                          holesCount: course.holesCount || 18
                        }
                      })}
                    >
                      <i className="fa fa-flag me-2"></i>
                      Setup Holes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewCourseDetails;
