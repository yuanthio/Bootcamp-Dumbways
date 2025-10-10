import pool from "./src/config/db.js";
import express from "express";
import hbs from "hbs";
import bcrypt from 'bcrypt';
import flash from 'express-flash';
import session from 'express-session';
import multer from 'multer';
import path from 'path';

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

hbs.registerHelper('techIcon', function (tech) {
  switch (tech) {
    case 'Node JS': return '<i class="fs-3 fa-brands fa-node-js"></i>';
    case 'Vue JS': return '<i class="fs-3 fa-brands fa-vuejs"></i>';
    case 'Golang': return '<i class="fs-3 fa-brands fa-golang"></i>';
    case 'Python': return '<i class="fs-3 fa-brands fa-python"></i>';
    default: return '';
  }
});

hbs.registerHelper('techIconDetail', function (tech) {
  switch (tech) {
    case 'Node JS': return '<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-node-js"></i> Node JS</h6></div>';
    case 'Vue JS': return '<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-vuejs"></i> Vue JS</h6></div>';
    case 'Golang': return '<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-golang"></i> Golang</h6></div>';
    case 'Python': return '<div class="col-lg-6 col-md-6"><h6><i class="fs-3 fa-brands fa-python"></i> Python</h6></div>';
    default: return '';
  }
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

const uploadPictureProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/assets/img/upload_profile');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadPictureRegister = multer({ storage: uploadPictureProfile });

const uploadPictureProjects = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/assets/img/upload_projects');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadPictureCardProjects = multer({ storage: uploadPictureProjects });

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

app.post('/projects', uploadPictureCardProjects.single('pictureProjects'), async (req, res) => {
  const { name, startDate, endDate, description } = req.body;
  let { teknologi } = req.body;
  try {
    if (!Array.isArray(teknologi)) {
      teknologi = [teknologi];
    }

    const jsonTeknologi = JSON.stringify(teknologi);

    const query = `
      INSERT INTO projects (name, startdate, enddate, description, teknologi, picture)
      VALUES ('${name}', '${startDate}', '${endDate}', '${description}', '${jsonTeknologi}', '${req.file.filename}');
    `;

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

app.post('/register', uploadPictureRegister.single('pictureProfile'), async (req, res) => {
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const EmailDuplikat = await pool.query(`SELECT * FROM users WHERE email='${email}'`);

    if (EmailDuplikat.rows.length > 0) {
      req.flash('error', 'Email sudah terdaftar');
      return res.redirect('/register');
    }

    const query = `INSERT INTO users(name, email, password, profile) VALUES ('${name}', '${email}', '${hashPassword}', '${req.file.filename}')`;
    await pool.query(query);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menyimpan data');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
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
      name: compareEmail.rows[0].name,
      profile: compareEmail.rows[0].profile
    }

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal login');
  }
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
    session = { name: req.session.user.name, profile: req.session.user.profile }
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
    session = { name: req.session.user.name, profile: req.session.user.profile }
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
    session = { name: req.session.user.name, profile: req.session.user.profile }
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

app.get("/detail/:id", requireLogin, async (req, res) => {
  let session;
  if (req.session.user) {
    session = { name: req.session.user.name, profile: req.session.user.profile }
  }

  const { id } = req.params;

  const query = `SELECT * FROM projects WHERE id='${id}'`;
  const result = await pool.query(query);

  res.render("detail", {
    layout: "layouts/main",
    title: "Detail - Yuanthio Virly",
    css: "../../assets/css/detail.css",
    result: result.rows[0],
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
