import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Username = () => {
  const fName = localStorage.getItem("fullName") || "user";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:1010/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        setUser(res.data.user);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="position-fixed bottom-0 end-0 m-3">
  <button onClick={handleLogout}
   className="btn btn-danger rounded-circle p-3 shadow">
    <i className="bi bi-box-arrow-right fs-4"></i>
  </button>
</div>

    <div  style={{backgroundColor:"#1e1e2e"}} className="welcome-container  ">
      <div className="welcome-card ">
        <h1 className="welcome-heading">
          Welcome,{" "}
          <span className="username">
            {fName}
            <span className="underline-animation"></span>
          </span>
        </h1>

        {user && (
          <div className="status-section">
            {user.isActive ? (
              <>
                <div className="approval-status approved">
                  <svg className="status-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                  </svg>
                  <span>Your account is fully verified and active</span>
                </div>
                <a href="/credential" className="dashboard-button">
                  Access Dashboard
                  <svg className="button-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </a>
              </>
            ) : (
              <div className="approval-status pending">
                <svg className="status-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
                </svg>
                <span>Account pending admin approval</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .welcome-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 2rem;
        }

        .welcome-card {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .welcome-heading {
          font-size: 2.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 2rem;
          font-family: 'Inter', sans-serif;
        }

        .username {
          color: #4f46e5;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }

        .underline-animation {
          content: '';
          position: absolute;
          width: 100%;
          height: 3px;
          bottom: -5px;
          left: 0;
          background: linear-gradient(90deg, #4f46e5 0%, #a855f7 100%);
          transform: scaleX(0);
          transform-origin: left;
          animation: underline 1.5s ease-in-out infinite alternate;
        }

        .status-section {
          margin-top: 2rem;
        }

        .approval-status {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .approved {
          background-color: #f0fdf4;
          color: #166534;
        }

        .pending {
          background-color: #fffbeb;
          color: #854d0e;
        }

        .status-icon {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.75rem;
        }

        .dashboard-button {
          display: inline-flex;
          align-items: center;
          background-color: #4f46e5;
          color: white;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
        }

        .dashboard-button:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -2px rgba(79, 70, 229, 0.05);
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-left: 0.5rem;
          transition: transform 0.2s ease;
        }

        .dashboard-button:hover .button-icon {
          transform: translateX(3px);
        }

        @keyframes underline {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #4f46e5;
        }

        .error-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #dc2626;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
    </>
  );
};

export default Username;