const  express =require ("express")
const { createCredential, getUserCredentials, getAllCredentials, deleteCredential, updateCredential }= require("../Controller/credentialController");
const authMiddleware = require("../Middleware/authMiddleware");

const routerCredential = express.Router();

routerCredential.post("/",authMiddleware, createCredential);

routerCredential.get("/user/:userId",authMiddleware, getUserCredentials);

routerCredential.delete("/credentials/:id", deleteCredential);
routerCredential.put("/credentials/:id", updateCredential);

routerCredential.get("/admin",authMiddleware,getAllCredentials)


module.exports=routerCredential
