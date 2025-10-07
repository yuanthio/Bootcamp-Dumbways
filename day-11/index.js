import pool from "./src/config/db.js";
import express from "express";
import hbs from "hbs";

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

hbs.registerPartials("src/views/partials");

app.use("/assets", express.static("src/assets"));

app.get("/home", (req, res) => {
  res.render("index", {
    layout: "layouts/main",
    title: "Home - Yuanthio Virly",
    css: "../../assets/css/style.css",
    js: "",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main",
    title: "Contact - Yuanthio Virly",
    css: "../../assets/css/contact.css",
    js: "",
  });
});

app.get("/projects", (req, res) => {
  res.render("projects", {
    layout: "layouts/main",
    title: "Projects - Yuanthio Virly",
    css: "../../assets/css/projects.css",
    js: "../../assets/js/projects.js",
  });
});

app.get("/detail", (req, res) => {
  res.render("detail", {
    layout: "layouts/main",
    title: "Detail - Yuanthio Virly",
    css: "../../assets/css/detail.css",
    js: "../../assets/js/detail.js",
  });
});

app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database connected! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
