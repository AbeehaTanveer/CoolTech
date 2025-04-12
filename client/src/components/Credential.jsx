import React, { useEffect, useState } from "react";
import axios from "axios";
import AddCredentialModal from "./AddCredentialModal";
import EditCredentialModal from "./EditCredential";
import { useNavigate } from "react-router-dom";

const Credential = () => {
  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState([]);
  const [access, setAccess] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Step 1: Get User Info
        const userRes = await axios.get(
          `http://localhost:1010/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = userRes.data.user;
        setUser(user);

        let credsRes;

        if (user.roles === "admin") {
          credsRes = await axios.get(`http://localhost:1010/credential/admin`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          credsRes = await axios.get(
            `http://localhost:1010/credential/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        setCredentials(credsRes.data.credentials);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleNewCredential = (newCredential) => {
    setCredentials([...credentials, newCredential]);
  };

  const handleDelete = async (credentialId) => {
    try {
      await axios.delete(
        `http://localhost:1010/credential/credentials/${credentialId}`
      );

      setCredentials(credentials.filter((cred) => cred._id !== credentialId));
    } catch (err) {
      console.error("Failed to delete credential", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="position-fixed bottom-0 end-0 m-3">
        <button
          onClick={handleLogout}
          className="btn btn-danger rounded-circle p-3 shadow"
        >
          <i className="bi bi-box-arrow-right fs-4"></i>
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            👋 Welcome, {fullName}{" "}
            {user?.roles === "manager"
              ? "(Manager)"
              : user?.roles === "admin"
              ? "(Admin)"
              : ""}
          </h1>
          <div className="flex space-x-4 text-gray-400">
            {user?.roles === "admin" ? (
              ""
            ) : (
              <>
                <p>
                  <span className="font-semibold">Organizational Unit:</span>{" "}
                  {user?.organizationalUnits?.join(", ") || "None"}
                </p>
                <p>
                  <span className="font-semibold">Division:</span>{" "}
                  {user?.divisions?.join(", ") || "None"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Credentials Management */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Credentials Management</h2>
            <AddCredentialModal
              divisions={user?.divisions || []}
              onSuccess={handleNewCredential}
            />
          </div>

          {/* Credentials Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Passowrds
                  </th>

                  {(user?.roles === "manager" || user?.roles === "admin") && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {credentials.length > 0 ? (
                  credentials.map((credential) => (
                    <tr key={credential._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {credential.serviceName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {credential.url}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {credential.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900 text-purple-200">
                          {credential.password}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {(user?.roles === "manager" ||
                            user?.roles === "admin") && (
                            <button
                              onClick={() => {
                                setSelectedCredential(credential);
                                setShowEditModal(true);
                              }}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              Edit
                            </button>
                          )}
                          {showEditModal && selectedCredential && (
                            <EditCredentialModal
                              credential={selectedCredential}
                              onClose={() => setShowEditModal(false)}
                              onUpdateSuccess={(updatedCred) => {
                                const updatedList = credentials.map((cred) =>
                                  cred._id === updatedCred._id
                                    ? updatedCred
                                    : cred
                                );
                                setCredentials(updatedList);
                                setShowEditModal(false);
                              }}
                            />
                          )}
                          {user?.roles === "admin" && (
                            <button
                              onClick={() => handleDelete(credential._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      No credentials found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credential;
