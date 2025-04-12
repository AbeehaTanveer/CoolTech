const express = require("express");
const cors = require("cors");
const { Database } = require("./Databse/database");
const router = require("./Routes/UserRoutes");
const routerCredential = require("./Routes/CredentialRoute");



require("dotenv").config(); 
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 1010;

// Api Route
app.get("/", (req, res) => {
  res.send("You are on the correct PORT");
  console.log("Hello World");
});

// Routes
app.use("", router)

app._router.stack.forEach(r => r.route && console.log(r.route.path));


app.use("/credential",routerCredential)


const startServer = async () => {
  try {
    await Database(); // Ensure database is connected before starting the server
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
  }
};

startServer();
