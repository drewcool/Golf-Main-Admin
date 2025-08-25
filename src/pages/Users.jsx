import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import AddUser from "../components/AddUser";
import TableUser from "../components/TableUser";
import { deleteUser } from "../utils/authUtils";
import axios from "axios";
import { getUserList } from "../utils/api";
import { APIURL } from "../utils/URL";

const Users = () => {
  const DEFAULT_ITEMS_PER_PAGE = 10;
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserList();
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

  const handleDelete = (id) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      Swal.fire({
        title: "Error!",
        text: "Authentication token is missing. Please log in again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${APIURL()}api/admin/deleteUser/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (response.status === 200) {
            setTableData((prevData) => prevData.filter((user) => user._id !== id)); // Use _id here
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          } else {
            throw new Error('Failed to delete the user');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the user. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
      }
    });
  };

  const handleEdit = (id) => {
    const user = tableData.find((u) => u._id === id);
    if (user) {
      setSelectedUser(user);
      setShowModal(true);
    }
  };

  const filteredData = tableData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleToggleStatus = async (id) => {
    const userToUpdate = tableData.find((user) => user._id === id);
    if (!userToUpdate) return;

    const newStatus = !userToUpdate.isActive;

    // Optimistic UI Update
    setTableData((prevData) =>
      prevData.map((user) =>
        user._id === id ? { ...user, isActive: newStatus } : user
      )
    );

    try {
      const response = await axios.put(
                 `https://golfserver.appsxperts.live/api/user/update-status/${id}`,
        // `http://13.51.189.31:5001/api/user/update-status/${id}`,
        // `http://localhost:5001/api/user/update-status/${id}`,
        { isActive: newStatus }, {
        headers: {
          Authorization: `Bearer ${authTokenExist}`,
        },
      }
      );
      if (response.status === 200) {
        Swal.fire("Success", `User status changed to ${newStatus ? "Active" : "Inactive"}`, "success");
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update user status. Please try again.", "error");

      setTableData((prevData) =>
        prevData.map((user) =>
          user._id === id ? { ...user, isActive: !newStatus } : user
        )
      );
    }
  };

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <div>
          <h1 className="">
            <span className="mr-4 fw-bold">&nbsp; All Users</span>
          </h1>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddUser
              user={selectedUser}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
      <div className="row mt-4">
        <div className="col-md-12 px-5">
          <div className="tile p-3">
            <div className="tile-body">
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
                  <div className="table-responsive mt-2">
                    <table className="table table-bordered table-hover dt-responsive">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>User Name</th>
                          <th>Email ID</th>
                          {/* <th>Status</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((user, index) => (
                          <tr key={user._id}>
                            <td>{index + 1 + currentPage * itemsPerPage}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {/* <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id={`toggle-${user._id}`}
                                  checked={user.isActive}
                                  onChange={() => handleToggleStatus(user._id)}
                                />
                              </div>
                            </td> */}
                            <td>
                              <TableUser
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                user={user}
                                handleDelete={() => handleDelete(user._id)}
                                handleEdit={() => handleEdit(user._id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      className="pagination"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginTop: "30px",
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

export default Users;