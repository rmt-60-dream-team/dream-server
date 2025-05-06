const express = require("express");
const app = express();
const cors = require("cors");
const UserController = require("./controllers/UserController");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", UserController.register);
app.post("/login", UserController.login);

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
