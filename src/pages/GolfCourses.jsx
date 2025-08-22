import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import AddSubAdmin from "../components/AddSubAdmin";
import TableSubAdmin from "../components/TableSubAdmin";
import { getGolfCoursesList } from "../utils/api";
import { Link } from "react-router-dom";
import { mediaUrl } from "../utils/URL";
import CoursesEdit from "../additionalPages/CoursesEdit";
import { DeleteGolfCourseApi } from "../utils/uploadApi";

const GolfCourses = () => {
  const DEFAULT_ITEMS_PER_PAGE = 10;
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const visiblePages = 4;
  const dropdownRef = useRef(null);

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

  const handleFormSubmit = (user) => {
    if (user.srNum) {
      setTableData((prevData) =>
        prevData.map((u) => (u.srNum === user.srNum ? user : u))
      );
    } else {
      const newUser = {
        ...user,
        srNum: tableData.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTableData((prevData) => [...prevData, newUser]);
    }
    Swal.fire({
      title: user.srNum ? "Sub-Admin Updated!" : "Sub-Admin Added!",
      icon: "success",
    });
    setShowModal(false);
    setSelectedUser(null);
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getGolfCoursesList();
      console.log("Response", res);
      setTableData(res);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch user data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleToggleStatus = (srNum) => {
    setTableData((prevData) =>
      prevData.map((user) =>
        user.srNum === srNum
          ? {
            ...user,
            status: user.status === "Active" ? "Inactive" : "Active",
          }
          : user
      )
    );
  };

  const handleDelete = async (srNum) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then( async(result) => {
      if (result.isConfirmed) {
        try { 
          await DeleteGolfCourseApi(srNum); // wait for delete to finish
          Swal.fire("Deleted!", "The golf course has been deleted.", "success");
          fetchData(); // now run fetch
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  const handleEdit = (srNum) => {
    const user = tableData.find((u) => u.srNum === srNum);
    if (user) {
      setSelectedUser(user);
      setShowModal(true);
    }
  };

  const filteredData = tableData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (openDropdown === selectedUser?.srNum) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, selectedUser]);

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <div>
          <h1 className="">
            <span className="mr-4 fw-bold">&nbsp;All GolfCourses</span>
          </h1>
        </div>
      </div>
      {/* {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddSubAdmin
              user={selectedUser}
              onClose={() => setShowModal(false)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )} */}
      <div className="row mb-5">
        <div className="col-md-12 px-5">
          <div className="bt-ad-emp">
            <Link to="/courses/add-courses" className="add-btt btn">
              <i className="fa-regular fa-plus"></i> Add Golf Course
            </Link>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12 px-5">
          <div className="tile p-3">
            <div className="tile-body">
              <div className="table-responsive">
                <div className="table-controls d-flex align-items-center justify-content-between">
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
                    <span className="entries-text ml-2">
                      &nbsp;entries per page
                    </span>
                  </div>
                  <div className="search-container">
                    <span className="search-text mr-2">Search:&nbsp;</span>
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
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "200px" }}
                  >
                    <div className="loader"></div>
                  </div>
                ) : (
                  <div className="table-responsive mt-2">paginatedData
                    <table className="table table-bordered table-hover dt-responsive">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Holes</th>
                          <th>Address</th>
                          <th>Phone</th>
                          <th>Email</th>
                          {/* <th>Website</th> */}
                          <th>Facilities</th>
                          <th>Description</th>
                          <th>Main Image</th>
                          <th>Gallery</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((course, index) => (
                          <tr key={index}>
                            <td>{index + 1 + currentPage * itemsPerPage}</td>
                            <td>{course.name}</td>
                            <td>{course.city}</td>
                            <td>{course.state}</td>
                            <td>{course.holesCount}</td>
                            <td>{course.address}</td>
                            <td>{course.contact?.phone}</td>
                            <td>{course.contact?.email}</td>
                            {/* <td>
                              <a href={course.contact?.website} target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </td> */}
                            <td>
                              {Array.isArray(course.facilities)
                                ? course.facilities.join(", ")
                                : course.facilities}
                            </td>
                            <td>{course.description}</td>
                            <td>
                              <img
                                src={mediaUrl() + course?.image}
                                alt="Main"
                                width="80"
                                height="60"
                                style={{ objectFit: "cover", borderRadius: "4px" }}
                              />
                            </td>
                            <td>
                              {Array.isArray(course?.gallery) &&
                                course.gallery.map((img, i) => (
                                  <img
                                    key={i}
                                    src={mediaUrl() + img}
                                    alt={`Gallery ${i}`}
                                    width="40"
                                    height="40"
                                    style={{ objectFit: "cover", marginRight: "4px", borderRadius: "4px" }}
                                  />
                                ))}
                            </td>
                            <td>
                              <CoursesEdit
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                                row={course}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>


                    <div className="pagination mt-4 mb-2 d-flex align-items-start justify-content-between">
                      <span className="pagination-info">
                        Showing {currentPage * itemsPerPage + 1} to{" "}
                        {Math.min(
                          (currentPage + 1) * itemsPerPage,
                          filteredData.length
                        )}{" "}
                        of {filteredData.length} entries
                      </span>
                      <div
                        className="page"
                        style={{
                          position: "absolute",
                          right: "12px",
                          margin: "-10px 0px 0px 0px",
                        }}
                      >
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

export default GolfCourses;
