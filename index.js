import express from "express";
import multer from "multer";

const app = express();
const port = 3000;

let posts = [];

// Image upload setup
const upload = multer({
    dest: "public/uploads/"
});

// EJS
app.set("view engine", "ejs");

// Public folder
app.use(express.static("public"));

// Read form data
app.use(express.urlencoded({ extended: true }));


// =========================
// HOME PAGE
// =========================

app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: posts
    });
});


// =========================
// CREATE PAGE
// =========================

app.get("/create", (req, res) => {
    res.render("create.ejs");
});


// =========================
// CREATE POST
// =========================

app.post("/create", upload.single("image"), (req, res) => {

    const newPost = {

        id: Date.now(),

        title: req.body.title,

        content: req.body.content,

        date: new Date().toLocaleDateString(),

        image: req.file
            ? `/uploads/${req.file.filename}`
            : null
    };

    posts.push(newPost);

    res.redirect("/");
});


// =========================
// EDIT PAGE
// =========================

app.get("/edit/:id", (req, res) => {

    const post = posts.find(
        post => post.id == req.params.id
    );

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("edit.ejs", {
        post: post
    });
});


// =========================
// EDIT POST
// =========================

app.post("/edit/:id", (req, res) => {

    const post = posts.find(
        post => post.id == req.params.id
    );

    if (!post) {
        return res.status(404).send("Post not found");
    }

    post.title = req.body.title;

    post.content = req.body.content;

    res.redirect("/");
});


// =========================
// DELETE POST
// =========================

app.post("/delete/:id", (req, res) => {

    posts = posts.filter(
        post => post.id != req.params.id
    );

    res.redirect("/");
});


// =========================
// START SERVER
// =========================

app.listen(port, () => {

    console.log(
        `Server running on http://localhost:${port}`
    );

});