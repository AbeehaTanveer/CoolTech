// controllers/credentialController.js
const Credential =require("../Model/CredentialModel")
const User =require ("../Model/UserModal")

// 👉 POST /credentials
exports.createCredential = async (req, res) => {
  try {
    const { serviceName, username, password } = req.body;

    if (!serviceName || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCredential = await Credential.create({
      serviceName,
      username,
      password,
      user: req.user.id, 
    });

    res.status(201).json({ message: "Credential added", credential: newCredential });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};



exports.updateCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, username, password } = req.body;

    const credential = await Credential.findById(id);

    if (!credential) {
      return res.status(404).json({ message: "Credential not found" });
    }


    // Update fields
    credential.serviceName = serviceName || credential.serviceName;
    credential.username = username || credential.username;
    credential.password = password || credential.password;

    await credential.save();

    res.status(200).json({ message: "Credential updated", credential });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};


// 👉 DELETE /credentials/:id

exports.deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;
 

    const deleted = await Credential.findOneAndDelete({
      _id: id,
  
    });

    if (!deleted) {
      return res.status(404).json({ message: "Credential not found or unauthorized" });
    }

    res.status(200).json({ message: "Credential deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// 👉 GET /credentials/user/:userId
exports.getUserCredentials = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const credentials = await Credential.find({ user: userId });
    res.status(200).json({ credentials });
  } catch (err) {
    res.status(500).json({ message: "Error fetching credentials", error: err.message });
  }
};

// 👉 GET /credentials (admin only)
exports.getAllCredentials = async (req, res) => {
  try {
    if (req.user.roles !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const credentials = await Credential.find().populate("user", "name email");
    res.status(200).json({ credentials });
  } catch (err) {
    res.status(500).json({ message: "Error fetching all credentials", error: err.message });
  }
};
