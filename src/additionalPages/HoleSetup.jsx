import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { saveCourseHoles, getCourseHoles } from "../utils/holeApi";

// Helper to build default hole object matching your JSON shape
const buildDefaultHole = (holeNumber, courseId, courseName) => ({
  courseId: courseId ?? null,
  courseName: courseName ?? "",
  hole: holeNumber,
  courseHoleId: null, // can be assigned by backend
  par: 4, // default
  hcp: 13, // optional default
  green: {
    enabled: false,
    coordinates: []
  },
  waterHazard: {
    enabled: false,
    coordinates: []
  },
  sandBunker: {
    enabled: false,
    coordinates: []
  },
  fairway: {
    enabled: false,
    coordinates: []
  },
  teeBoxes: [
    { teeType: "pro", color: "black", par: 4, yards: "", meters: "", hcp: "", hex: "#000000", lat: "", lng: "" },
    { teeType: "champion", color: "blue", par: 4, yards: "", meters: "", hcp: "", hex: "#0000ff", lat: "", lng: "" },
    { teeType: "men", color: "gold", par: 4, yards: "", meters: "", hcp: "", hex: "#D4A017", lat: "", lng: "" },
    { teeType: "women", color: "red", par: 4, yards: "", meters: "", hcp: "", hex: "#ff0000", lat: "", lng: "" },
  ],
});

const HoleSetup = () => {
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const holesCount = Number(state?.holesCount || 18);
  const courseId = state?.courseId || null;
  const courseName = state?.courseName || "";

  // Initialize holes array
  const initialHoles = useMemo(
    () => Array.from({ length: holesCount }, (_, i) => buildDefaultHole(i + 1, courseId, courseName)),
    [holesCount, courseId, courseName]
  );

  const [holes, setHoles] = useState(initialHoles);
  const [loading, setLoading] = useState(false);

  // Load existing holes when component mounts
  useEffect(() => {
    const loadExistingHoles = async () => {
      if (courseId) {
        try {
          setLoading(true);
          const response = await getCourseHoles(courseId);
          if (response.status && response.data.holes.length > 0) {
            // Transform old green structure to new structure if needed
            const transformedHoles = response.data.holes.map(hole => {
              // If green has old structure (lat/lng directly), convert to new structure
              if (hole.green && typeof hole.green === 'object' && 'lat' in hole.green && 'lng' in hole.green && !('enabled' in hole.green)) {
                const hasCoordinates = hole.green.lat || hole.green.lng;
                return {
                  ...hole,
                  green: {
                    enabled: hasCoordinates,
                    coordinates: hasCoordinates ? [{ lat: hole.green.lat || '', lng: hole.green.lng || '' }] : []
                  }
                };
              }
              return hole;
            });
            
            setHoles(transformedHoles);
          }
        } catch (error) {
          // swallow
        } finally {
          setLoading(false);
        }
      }
    };

    loadExistingHoles();
  }, [courseId]);

  const updateHoleField = (index, path, value) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[index] };
      // Handle top-level fields only (par, hcp, etc.)
      hole[path] = value;
      copy[index] = hole;
      return copy;
    });
  };

  const updateSectionField = (holeIndex, section, field, value) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      hole[section] = { ...hole[section], [field]: value };
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const addCoordinate = (holeIndex, section) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      hole[section].coordinates = [...hole[section].coordinates, { lat: "", lng: "" }];
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const removeCoordinate = (holeIndex, section, coordIndex) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      hole[section].coordinates = hole[section].coordinates.filter((_, i) => i !== coordIndex);
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const updateCoordinate = (holeIndex, section, coordIndex, field, value) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      hole[section].coordinates[coordIndex] = { 
        ...hole[section].coordinates[coordIndex], 
        [field]: value 
      };
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const updateTeeBoxField = (holeIndex, teeIndex, field, value) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      const teeBoxes = hole.teeBoxes.map((t, i) => (i === teeIndex ? { ...t, [field]: value } : t));
      hole.teeBoxes = teeBoxes;
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const addTeeBox = (holeIndex) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      hole.teeBoxes = [
        ...hole.teeBoxes,
        { teeType: "", color: "", par: "", yards: "", meters: "", hcp: "", hex: "", lat: "", lng: "" },
      ];
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const removeTeeBox = (holeIndex, teeIndex) => {
    setHoles((prev) => {
      const copy = [...prev];
      const hole = { ...copy[holeIndex] };
      hole.teeBoxes = hole.teeBoxes.filter((_, i) => i !== teeIndex);
      copy[holeIndex] = hole;
      return copy;
    });
  };

  const handleSubmit = async () => {
    // Check if courseId exists
    if (!courseId) {
      Swal.fire("Error", "Course ID is missing. Please go back and create a course first.", "error");
      return;
    }

    // Validate minimally (e.g., ensure at least one teeBox per hole and numeric yards/meters)
    const invalid = holes.some((h) =>
      h.teeBoxes.length === 0 ||
      h.teeBoxes.some((t) => !t.teeType || !t.par || (!t.yards && !t.meters))
    );
    if (invalid) {
      Swal.fire("Validation", "Each hole needs at least one tee box with teeType, par, and yards or meters.", "warning");
      return;
    }

    try {
      setLoading(true);
      // Call the API to save holes
      const response = await saveCourseHoles(courseId, holes);
      
      if (response.status) {
        await Swal.fire("Success", "Holes and tee boxes saved successfully.", "success");
        navigate("/golf-courses"); // redirect to GolfCourses page
      } else {
        throw new Error(response.message || "Failed to save holes");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err?.message || "Failed to save holes", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderCoordinateSection = (holeIndex, section, sectionName, isOptional = false) => {
    const hole = holes[holeIndex];
    const sectionData = hole[section];
    
    return (
      <div className="border rounded p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>{sectionName}</strong>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={sectionData.enabled}
              onChange={(e) => updateSectionField(holeIndex, section, "enabled", e.target.checked)}
              id={`${section}-${holeIndex}`}
            />
            <label className="form-check-label" htmlFor={`${section}-${holeIndex}`}>
              Enable {sectionName}
            </label>
          </div>
        </div>
        
        {sectionData.enabled && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Coordinates</span>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-primary"
                onClick={() => addCoordinate(holeIndex, section)}
              >
                + Add Coordinate
              </button>
            </div>
            
            {sectionData.coordinates.map((coord, coordIndex) => (
              <div className="row g-2 mb-2" key={coordIndex}>
                <div className="col-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Latitude"
                    value={coord.lat}
                    onChange={(e) => updateCoordinate(holeIndex, section, coordIndex, "lat", e.target.value)}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Longitude"
                    value={coord.lng}
                    onChange={(e) => updateCoordinate(holeIndex, section, coordIndex, "lng", e.target.value)}
                  />
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeCoordinate(holeIndex, section, coordIndex)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <h1><span className="mr-4 fw-bold">Setup Holes — {courseName || "New Course"}</span></h1>
        
        {/* Warning when courseId is missing */}
        {!courseId && (
          <div className="alert alert-warning mt-2" role="alert">
            <strong>⚠️ Warning:</strong> No course ID found. Please go back and create a course first, then return to this page.
          </div>
        )}
        
        {loading && (
          <div className="mt-2">
            <div className="spinner-border spinner-border-sm text-light me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-light">Loading...</span>
          </div>
        )}
      </div>

      <div className="container-fluid">
        <div className="row">
          {holes.map((hole, holeIndex) => (
            <div className="col-md-6 mb-4" key={holeIndex}>
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#00489d", color: "#fff" }}>
                  <strong>Hole {hole.hole}</strong>
                  <span>Par</span>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: 80 }}
                    value={hole.par}
                    onChange={(e) => updateHoleField(holeIndex, "par", Number(e.target.value))}
                  />
                </div>

                <div className="card-body">
                  {/* Green Section */}
                  {renderCoordinateSection(holeIndex, "green", "Green", true)}

                  {/* Water Hazard Section */}
                  {renderCoordinateSection(holeIndex, "waterHazard", "Water Hazard", true)}

                  {/* Sand Bunker Section */}
                  {renderCoordinateSection(holeIndex, "sandBunker", "Sand Bunker")}

                  {/* Fairway Section */}
                  {renderCoordinateSection(holeIndex, "fairway", "Fairway", true)}

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Tee Boxes</strong>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addTeeBox(holeIndex)}>
                      + Add Tee Box
                    </button>
                  </div>

                  {hole.teeBoxes.map((tee, teeIndex) => (
                    <div className="border rounded p-2 mb-2" key={teeIndex}>
                      <div className="row g-2">
                        <div className="col-md-3">
                          <label className="form-label">Tee Type</label>
                          <input
                            type="text"
                            className="form-control"
                            value={tee.teeType}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "teeType", e.target.value)}
                            placeholder="pro/champion/men/women"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Color</label>
                          <input
                            type="text"
                            className="form-control"
                            value={tee.color}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "color", e.target.value)}
                            placeholder="black/red/..."
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Par</label>
                          <input
                            type="number"
                            className="form-control"
                            value={tee.par}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "par", Number(e.target.value))}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Yards</label>
                          <input
                            type="number"
                            className="form-control"
                            value={tee.yards}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "yards", e.target.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Meters</label>
                          <input
                            type="number"
                            className="form-control"
                            value={tee.meters}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "meters", e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Hex</label>
                          <input
                            type="text"
                            className="form-control"
                            value={tee.hex}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "hex", e.target.value)}
                            placeholder="#RRGGBB"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Lat</label>
                          <input
                            type="text"
                            className="form-control"
                            value={tee.lat}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "lat", e.target.value)}
                            placeholder="e.g. 37.7749"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Lng</label>
                          <input
                            type="text"
                            className="form-control"
                            value={tee.lng}
                            onChange={(e) => updateTeeBoxField(holeIndex, teeIndex, "lng", e.target.value)}
                            placeholder="e.g. -122.4194"
                          />
                        </div>
                        <div className="col-md-12 d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeTeeBox(holeIndex, teeIndex)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end my-3">
          <button className="btn btn-secondary me-2" onClick={() => navigate(-1)} disabled={loading}>Back</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={loading || !courseId}
            title={!courseId ? "Course ID is required to save holes" : ""}
          >
            {loading ? "Saving..." : "Save Holes"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default HoleSetup;
