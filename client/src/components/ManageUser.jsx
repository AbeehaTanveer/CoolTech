import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FiUsers,
  FiCheckCircle,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  const roleOptions = [
    { value: "normal", label: "Normal User", color: "#6c757d" },
    { value: "manager", label: "Manager", color: "#17a2b8" },
    { value: "admin", label: "Administrator", color: "#dc3545" },
  ];

  const orgUnitOptions = [
    { value: "News Management", label: "📰 News Management" },
    { value: "Software Reviews", label: "💻 Software Reviews" },
    { value: "Hardware Reviews", label: "🖥️ Hardware Reviews" },
    { value: "Opinion Publishing", label: "✍️ Opinion Publishing" },
  ];

  const divisionOptions = [
    { value: "Finance", label: "💰 Finance" },
    { value: "IT Support", label: "🛠️ IT Support" },
    { value: "Content Writing", label: "✏️ Content Writing" },
    { value: "Editing and Proofreading", label: "🔍 Editing & Proofreading" },
    { value: "Marketing and Promotion", label: "📢 Marketing & Promotion" },
    { value: "Research and Development", label: "🔬 R&D" },
    { value: "Quality Assurance", label: "✅ Quality Assurance" },
    { value: "User Experience (UX) Design", label: "🎨 UX Design" },
    { value: "Analytics and Reporting", label: "📊 Analytics" },
    { value: "Legal and Compliance", label: "⚖️ Legal" },
    { value: "Community Engagement", label: "🤝 Community" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:1010/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser({
      ...user,
      organizationalUnits: user.organizationalUnits || [],
      divisions: user.divisions || [],
    });
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:1010/users/${selectedUser._id}/approve`,
        {
          roles: selectedUser.roles,
          organizationalUnits: selectedUser.organizationalUnits.map(
            (ou) => ou.value
          ),
          divisions: selectedUser.divisions.map((div) => div.value),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#2d3748",
      borderColor: "#4a5568",
      color: "white",
      minHeight: "44px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2d3748",
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4299e1"
        : state.isFocused
        ? "#4a5568"
        : "#2d3748",
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#4a5568",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#e53e3e",
        color: "white",
      },
    }),
  };

  return (
    <>
      <div className="position-fixed bottom-0 end-0 m-3">
        <button
          onClick={handleLogout}
          className="btn btn-danger rounded-circle p-3 shadow"
        >
          <i className="bi bi-box-arrow-right fs-4"></i>
        </button>
      </div>

      <div
        className="admin-dashboard"
        style={{
          backgroundColor: "#1a202c",
          minHeight: "100vh",
          color: "white",
          padding: "2rem",
        }}
      >
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="d-flex align-items-center"
              >
                <FiSettings size={28} className="me-3 text-primary" />
                <h1 className="m-0">User Management Console</h1>
              </motion.div>
              <p className="text-gray-400">
                Approve new users and assign access privileges
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-5 mb-4">
              <motion.div
                className="card shadow-lg border-0"
                style={{
                  backgroundColor: "#2d3748",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card-header bg-dark d-flex align-items-center">
                  <FiUsers className="me-2" />
                  <h5 className="m-0 text-white">Pending Approvals</h5>
                  <span className="badge bg-primary ms-auto">
                    {users.length} Members
                  </span>
                </div>
                <div
                  className="card-body p-0"
                  style={{
                    overflowY: "auto",
                    flex: "1",
                    maxHeight: "calc(100vh - 250px)",
                  }}
                >
                  {isLoading ? (
                    <div className="text-center p-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                      No pending approvals
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {users.map((user, index) => (
                        <motion.div
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <button
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                              selectedUser?._id === user._id ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                selectedUser?._id === user._id
                                  ? "#4299e1"
                                  : "#2d3748",
                              borderColor: "#4a5568",
                              color: "white",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            onClick={() => handleSelectUser(user)}
                          >
                            <div style={{ minWidth: 0 }}>
                              <h6 className="mb-1 text-truncate">
                                {user.fullName}
                              </h6>
                              <small className="text-muted text-truncate d-block">
                                {user.email}
                              </small>
                            </div>
                            <FiChevronRight />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* User Assignment Panel */}
            <div className="col-lg-7">
              {selectedUser ? (
                <motion.div
                  className="card shadow-lg border-0 d-flex flex-column"
                  style={{
                    backgroundColor: "#2d3748",
                    maxHeight: "calc(100vh - 200px)",
                    overflow: "hidden",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="card-header bg-dark">
                    <h5 className="m-0 text-white">
                      Assign Access for {selectedUser.fullName}
                    </h5>
                  </div>

                  <div
                    className="card-body overflow-y-auto"
                    style={{ flex: "1 1 auto" }}
                  >
                    <div className="mb-4">
                      <label className="form-label text-white">User Role</label>
                      <Select
                        options={roleOptions}
                        value={roleOptions.find(
                          (opt) => opt.value === selectedUser.roles
                        )}
                        onChange={(selected) =>
                          setSelectedUser({
                            ...selectedUser,
                            roles: selected.value,
                          })
                        }
                        isSearchable={false}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "#2d3748",
                            borderColor: "#4a5568",
                            color: "white",
                            "&:hover": {
                              borderColor: "#4a5568",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "white",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#2d3748",
                            borderColor: "#4a5568",
                          }),
                          option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected
                              ? "#4299e1"
                              : isFocused
                              ? "#4a5568"
                              : "#2d3748",
                            color: "white",
                            "&:active": {
                              backgroundColor: "#2b6cb0",
                            },
                          }),
                          input: (base) => ({
                            ...base,
                            color: "white",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#a0aec0",
                          }),
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-white">
                        Organizational Units
                      </label>
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={orgUnitOptions}
                        value={selectedUser.organizationalUnits}
                        onChange={(selected) =>
                          setSelectedUser({
                            ...selectedUser,
                            organizationalUnits: selected,
                          })
                        }
                        styles={customStyles}
                        placeholder="Select OUs..."
                        menuPlacement="auto"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-white">Divisions</label>
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={divisionOptions}
                        value={selectedUser.divisions}
                        onChange={(selected) =>
                          setSelectedUser({
                            ...selectedUser,
                            divisions: selected,
                          })
                        }
                        styles={customStyles}
                        placeholder="Select divisions..."
                        menuPlacement="auto"
                      />
                    </div>
                  </div>

                  <div
                    className="card-footer bg-dark p-3"
                    style={{
                      position: "sticky",
                      bottom: 0,
                      zIndex: 10,
                    }}
                  >
                    <motion.button
                      className="btn btn-primary w-100 py-3"
                      onClick={handleApprove}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiCheckCircle className="me-2" />
                      Approve & Assign Access
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="card shadow-lg border-0 text-center"
                  style={{ backgroundColor: "#2d3748", minHeight: "300px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="card-body d-flex flex-column justify-content-center">
                    <div className="text-gray-200 mb-3">
                      <FiUsers size={48} />
                    </div>
                    <h5 className="mb-2 text-gray-200 ">No User Selected</h5>
                    <p className="text-gray-200">
                      Please select a user from the list to assign access
                      privileges
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          body {
            background-color: #1a202c;
          }
          .admin-dashboard {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .card {
            border-radius: 12px;
            overflow: hidden;
          }
          .list-group-item {
            transition: all 0.3s ease;
          }
          .react-select__single-value {
            color: white !important;
          }
          .react-select__input input {
            color: white !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default AdminDashboard;
