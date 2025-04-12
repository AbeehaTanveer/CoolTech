// routes/credentialRoutes.js
const  express =require ("express")
const { createCredential, getUserCredentials, getAllCredentials, deleteCredential, updateCredential }= require("../Controller/credentialController");
const authMiddleware = require("../Middleware/authMiddleware");

const routerCredential = express.Router();

// POST: Add new credential
routerCredential.post("/",authMiddleware, createCredential);

// GET: Get credentials of logged-in user
routerCredential.get("/user/:userId",authMiddleware, getUserCredentials);

routerCredential.delete("/credentials/:id", deleteCredential);
routerCredential.put("/credentials/:id", updateCredential);

routerCredential.get("/admin",authMiddleware,getAllCredentials)

// GET: Admin - get all credentials

module.exports=routerCredential
