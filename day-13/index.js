import pool from "./src/config/db.js";
import express from "express";
import hbs from "hbs";
import bcrypt from 'bcrypt';
import flash from 'express-flash';
import session from 'express-session';

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
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'YuanGans',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 }
}));
app.use((req, res, next) => {
  res.locals.session = req.session.user || null;
  next();
});

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  }
  next();
}

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  next();
}

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

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const EmailDuplikat = await pool.query(`SELECT * FROM users WHERE email='${email}'`);

    if (EmailDuplikat.rows.length > 0) {
      req.flash('error', 'Email sudah terdaftar');
      return res.redirect('/register');
    }

    const query = `INSERT INTO users(name, email, password) VALUES ('${name}', '${email}', '${hashPassword}')`;
    await pool.query(query);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menyimpan data');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const compareEmail = await pool.query(`SELECT * FROM users WHERE email='${email}'`);

  if (!compareEmail.rows.length) {
    req.flash('error', 'Email salah');
    return res.redirect('/login');
  }

  const comparePassword = await bcrypt.compare(password, compareEmail.rows[0].password);

  if (!comparePassword) {
    req.flash('error', 'Password salah');
    return res.redirect('/login');
  }

  req.session.user = {
    name: compareEmail.rows[0].name
  }

  res.redirect('/home');
});

app.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("register", {
    layout: "layouts/main",
    title: "Register - Yuanthio Virly",
    css: "../../assets/css/register.css",
    message: req.flash('error')
  });
});

app.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("login", {
    layout: "layouts/main",
    title: "Login - Yuanthio Virly",
    css: "../../assets/css/login.css",
    message: req.flash('error')
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Gagal keluar');
    }

    res.redirect('/login');
  });
});

app.get("/home", requireLogin, (req, res) => {
  let session;
  if (req.session.user) {
    session = req.session.user.name;
  }

  res.render("index", {
    layout: "layouts/main",
    title: "Home - Yuanthio Virly",
    css: "../../assets/css/style.css",
    session
    // js: "",
  });
});

app.get("/contact", requireLogin, (req, res) => {
  let session;
  if (req.session.user) {
    session = req.session.user.name;
  }

  res.render("contact", {
    layout: "layouts/main",
    title: "Contact - Yuanthio Virly",
    css: "../../assets/css/contact.css",
    session
    // js: "",
  });
});

app.get("/projects", requireLogin, async (req, res) => {
  let session;
  if (req.session.user) {
    session = req.session.user.name;
  }

  try {
    const query = `SELECT * FROM projects`;
    const result = await pool.query(query);
    const { status } = req.query;

    res.render("projects", {
      layout: "layouts/main",
      title: "Projects - Yuanthio Virly",
      css: "../../assets/css/projects.css",
      projects: result.rows,
      status,
      session
      // js: "../../assets/js/projects.js",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal membaca data');
  }
});

app.get("/detail", requireLogin, (req, res) => {
  let session;
  if (req.session.user) {
    session = req.session.user.name;
  }

  res.render("detail", {
    layout: "layouts/main",
    title: "Detail - Yuanthio Virly",
    css: "../../assets/css/detail.css",
    session
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
