import pool from "./src/config/db.js";
import express from "express";
import hbs from "hbs";

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

hbs.registerPartials("src/views/partials");
hbs.registerHelper('statusUrl', (a, b) => a === b);
hbs.registerHelper('formatDate', (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
});

app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.post('/projects', async (req, res) => {
  const { name, startDate, endDate, description } = req.body;
  const projects = {
    name,
    startDate,
    endDate,
    description
  }

  try {
    const query = `INSERT INTO projects(name, startdate, enddate, description) VALUES ('${projects.name}', '${projects.startDate}', '${projects.endDate}', '${projects.description}')`;
    await pool.query(query);
    res.redirect('/projects?status=add');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambah data');
  }
});

app.post('/projects/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM projects where id = ${id}`;
    await pool.query(query);
    res.redirect('/projects?status=delete');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menghapus data')
  }

});

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

app.get("/projects", async (req, res) => {
  try {
    const query = `SELECT * FROM projects`;
    const result = await pool.query(query);
    const { status } = req.query;

    res.render("projects", {
      layout: "layouts/main",
      title: "Projects - Yuanthio Virly",
      css: "../../assets/css/projects.css",
      projects: result.rows,
      status
      // js: "../../assets/js/projects.js",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal membaca data');
  }
});

app.get("/detail", (req, res) => {
  res.render("detail", {
    layout: "layouts/main",
    title: "Detail - Yuanthio Virly",
    css: "../../assets/css/detail.css",
    // js: "../../assets/js/detail.js",
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
