import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const name = localStorage.getItem("fullName") || "User";


  // Card Component with Parallax Effect
  const FeatureCard = ({ title }) => (
    <motion.div
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl overflow-hidden h-64"
      whileHover={{ y: -10 }}
      style={{
        perspective: "1000px"
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        whileHover={{
          rotateY: 10,
          rotateX: -5,
          transition: { duration: 0.5 }
        }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-7"></div>
      </motion.div>
      <div className="relative z-10 h-full flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
    </motion.div>
  );

  return (
    <>


    <div className="min-h-screen bg-gray-900 p-4">


      <motion.h1
        className="text-center text-5xl md:text-7xl font-extrabold my-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        >
        Welcome Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Link to={"/credential"} style={{ textDecoration: 'none' }}>
        <FeatureCard title="View Credentials" />
      </Link>
        <Link to={"/users"} style={{ textDecoration: 'none' }}>
        <FeatureCard title="Manage Users" />
        </Link>
      </div>
    </div>
    
  
        </>
  );
};

export default Dashboard;