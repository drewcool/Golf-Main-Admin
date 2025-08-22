import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import ViewBusiness from "../components/ViewBusiness";
import ViewVehicleModal from "../components/ViewVehicleModal";
import EditProviderModal from "../components/EditProviderModal";
import { getLessionsList } from "../utils/api";
import { APIURL, mediaUrl } from "../utils/URL";
import { DeleteLessionApi } from "../utils/uploadApi";

const Lessions = () => {
  const DEFAULT_ITEMS_PER_PAGE = 10;
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const authTokenExist = localStorage.getItem("authToken");

  const dropdownRef = useRef(null);
  const visiblePages = 4;

  const getPaginationButtons = () => {
    const buttons = [];
    let startPage = Math.max(0, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(0, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage;
      buttons.push(
        <button
          key={i}
          style={{
            padding: "7px 10px",
            backgroundColor: isActive ? "#00489d" : "#e9ecef",
            color: isActive ? "white" : "#00489d",
            border: "1px solid lightgrey",
          }}
          className={`page-btn ${isActive ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getLessionsList();
      console.log("Response", res);
      setTableData(res.data);
    } catch (error) {
      console.log(error.response.data.message);
      
      Swal.fire({
        icon: "error",
        title: "0 Lessions",
        text: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewBusiness = (businessInfo) => {
    if (!businessInfo) return;
    setSelectedBusiness(businessInfo);
    setShowBusinessModal(true);
  };

  const handleCloseBusinessModal = () => {
    setShowBusinessModal(false);
    setSelectedBusiness(null);
  };

  const handleViewVehicle = (vehicleInfo) => {
    console.log("Vehicle Info before setting state:", vehicleInfo);
    setSelectedVehicle(vehicleInfo);
    setShowVehicleModal(true);
  };


  const handleEditProvider = (provider) => {
    setSelectedProvider(provider);
    setShowEditModal(true);
  };

  const handleSaveProvider = (updatedProvider) => {
    setTableData(prev =>
      prev.map(p => (p._id === updatedProvider._id ? updatedProvider : p))
    );
    setShowEditModal(false);
  };

  // Handle deleting a provider
  const handleDelete = async (srNum) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        setTableData((prevData) => prevData.filter((user) => user.srNum !== srNum));
        await DeleteLessionApi(srNum);
        Swal.fire("Deleted!", "Your Lession has been deleted.", "success");
        await fetchData(); // Wait for fresh data
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete Lession.", "error");
        await fetchData(); // Re-fetch on error
      }
    }
  };

  // Handle changing items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleStatus = async (id, isActive, authTokenExist) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to ${isActive ? "deactivate" : "activate"} this user.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      });

      if (!result.isConfirmed) {
        return;
      }

      const response = await fetch(
        `${APIURL()}api/admin/editLession/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokenExist}`,
          },
          body: JSON.stringify({
            status: !isActive, // Toggle status
          }),
        }
      );

      const data = await response.json();

      await fetchData()

      if (response.ok) {
        setTableData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, isActive: !isActive } : item
          )
        );

        Swal.fire({
          title: "Updated!",
          text: `User has been ${!isActive ? "activated" : "deactivated"}.`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to update status.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
      });
    }
  };


  // Filter data based on search term
  const filteredData = tableData.filter((user) =>
    user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages and paginated data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle edit action
  const handleEdit = () => {
    navigate("/manage-program/add-program");
  };

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <div>
          <h1>
            <span className="mr-4 fw-bold">&nbsp; Manage Lessions</span>
          </h1>
        </div>
      </div>
      {showBusinessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ViewBusiness businessInfo={selectedBusiness} onClose={() => setShowBusinessModal(false)} />
          </div>
        </div>
      )}

      {showVehicleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ViewVehicleModal vehicleInfo={selectedVehicle} onClose={() => setShowVehicleModal(false)} />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditProviderModal
              provider={selectedProvider} onClose={() => setShowEditModal(false)} onSave={handleSaveProvider} />
          </div>
        </div>
      )}

      <div className="row mb-5">
        <div className="col-md-12 px-5">
          <div className="bt-ad-emp">
            <Link to="/lessions/add-lessions" className="add-btt btn">
              <i className="fa-regular fa-plus"></i> Add Lession
            </Link>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12 px-5">
          <div className="tile">
            <div className="tile-body p-3">
              <div className="table-responsive">
                <div
                  className="table-controls"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="items-per-page-container">
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="items-per-page-select"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span
                      className="entries-text"
                      style={{ marginLeft: "10px" }}
                    >
                      entries per page
                    </span>
                  </div>
                  <div className="search-container">
                    <span
                      className="search-text"
                      style={{ marginRight: "10px" }}
                    >
                      Search:
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="search-input"
                    />
                  </div>
                </div>
                {loading ? (
                  <div
                    style={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="loader"></div>
                  </div>
                ) : (
                  <div className="table-responsive">
                  <table
  className="table table-bordered table-hover dt-responsive mt-2"
  id="data-table"
>
  <thead>
    <tr>
      <th>S.No</th>
      <th>Title</th>
      <th>Description</th>
      <th>Thumbnail</th>
      <th>Video</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  {paginatedData.map((lesson, index) => (
    <tr key={index}>
      <td>{currentPage * itemsPerPage + index + 1}</td>
      <td>{lesson.title}</td>
      <td>{lesson.description}</td>

      {/* Thumbnail Image */}
      <td>
        <img
          src={mediaUrl() + lesson.thumbnail}
          alt="Thumbnail"
          style={{
            width: "80px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "4px",
            display: "block",
          }}
        />
      </td>

      {/* Video Preview */}
      <td>
      <td>
  <div style={{ width: "120px", height: "80px", overflow: "hidden", position: "relative" }}>
    <video
      controls
      src={mediaUrl() + lesson.video}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    >
      Your browser does not support the video tag.
    </video>
  </div>
</td>
      </td>

      {/* Status Toggle */}
      <td>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={lesson.status === true}
            onChange={() =>
              toggleStatus(lesson._id, lesson.status , authTokenExist)
            }
          />
        </div>
      </td>

      {/* Action Dropdown */}
      <td>
        <div ref={dropdownRef} className="dropdown text-center">
          <button
            className="dropdown-button"
            onClick={() =>
              setOpenDropdown(openDropdown === lesson._id ? null : lesson._id)
            }
            aria-haspopup="true"
            aria-expanded={openDropdown === lesson._id}
          >
            <i
              className={`fa fa-ellipsis-v ${
                openDropdown === lesson._id ? "rotate-icon" : ""
              }`}
            ></i>
          </button>

          {openDropdown === lesson._id && (
            <div className="dropdown-menu show">
              {/* <button
                className="dropdown-item"
                onClick={() => handleEditProvider(lesson)}
              >
                <i className="fa fa-edit"></i> Edit
              </button> */}
              <a
                className="dropdown-item"
                onClick={() => {
                  handleDelete(lesson._id);
                  setOpenDropdown(null);
                }}
              >
                <i className="fa fa-trash"></i> Delete
              </a>
            </div>
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>

</table>

                    <div
                      className="pagination"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="pagination-info">
                        Showing {currentPage * itemsPerPage + 1} to{" "}
                        {Math.min(
                          (currentPage + 1) * itemsPerPage,
                          filteredData.length
                        )}{" "}
                        of {filteredData.length} entries
                      </span>
                      <div>
                        <button
                          style={{
                            padding: "7px 10px",
                            backgroundColor: "#e9ecef",
                            color: "#00489d",
                            border: "1px solid lightgrey",
                            borderRadius: "5px 0px 0px 5px",
                          }}
                          className="page-btn"
                          onClick={() => handlePageChange(0)}
                          disabled={currentPage === 0}
                          aria-label="First Page"
                        >
                          &laquo;
                        </button>
                        <button
                          style={{
                            padding: "7px 10px",
                            backgroundColor: "#e9ecef",
                            color: "#00489d",
                            border: "1px solid lightgrey",
                          }}
                          className="page-btn"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          aria-label="Previous Page"
                        >
                          &#x3c;
                        </button>
                        {getPaginationButtons()}
                        <button
                          style={{
                            padding: "7px 10px",
                            backgroundColor: "#e9ecef",
                            color: "#00489d",
                            border: "1px solid lightgrey",
                          }}
                          className="page-btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                          aria-label="Next Page"
                        >
                          &#x3e;
                        </button>
                        <button
                          style={{
                            padding: "7px 10px",
                            backgroundColor: "#e9ecef",
                            color: "#00489d",
                            border: "1px solid lightgrey",
                            borderRadius: "0px 5px 5px 0px",
                          }}
                          className="page-btn"
                          onClick={() => handlePageChange(totalPages - 1)}
                          disabled={currentPage >= totalPages - 1}
                          aria-label="Last Page"
                        >
                          &raquo;
                        </button>
                      </div>
                    </div>
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

export default Lessions;