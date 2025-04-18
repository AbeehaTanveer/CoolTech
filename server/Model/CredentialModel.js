const mongoose =require("mongoose")

const credentialSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports= mongoose.model("Credential", credentialSchema);
