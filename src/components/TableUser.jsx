import React, { useEffect, useRef } from "react";

const TableUser = ({ setOpenDropdown, user, openDropdown , handleEdit , handleDelete }) => {
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (openDropdown === user._id) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, setOpenDropdown, user._id]);
  return (
    <div className="dropdown text-center" ref={dropdownRef}>
      <button
        className="dropdown-button"
        onClick={() =>
          setOpenDropdown(openDropdown === user._id ? null : user._id)
        }
        aria-haspopup="true"
        aria-expanded={openDropdown === user._id}
      >
        <i
          className={`fa fa-ellipsis-v ${
            openDropdown === user._id ? "rotate-icon" : ""
          }`}
        ></i>
      </button>
      {openDropdown === user._id && (
        <div className="dropdown-menu show">
          <button
            className="dropdown-item"
            onClick={() => {
              handleEdit(user._id);
              setOpenDropdown(null);
            }}
          >
            <i className="fa fa-edit"></i> View
          </button>
          <button
            className="dropdown-item"
            onClick={() => {
              handleDelete(user._id);
              setOpenDropdown(null);
            }}
          >
            <i className="fa fa-trash"></i> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TableUser;
