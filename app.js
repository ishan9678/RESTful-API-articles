const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then((found) => {
        res.send(found);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post((req, res) => {
    Article.insertMany([{ title: req.body.title, content: req.body.content }])
      .then(() => {
        console.log("Data inserted");
        res.send("Data inserted");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error occurred");
      });
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("Deleted all articles");
      })
      .catch((err) => {
        console.log(err);
      });
  });

app
  .route("/articles/:article")
  .get((req, res) => {
    articleName = req.params.article;
    Article.find({ title: articleName })
      .then((found) => {
        res.send(found);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .put((req, res) => {
    articleName = req.params.article;
    Article.findOneAndUpdate(
      { title: articleName },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    )
      .then(() => {
        res.send("Overwritten");
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .patch((req, res) => {
    Article.findOneAndUpdate({ title: req.params.article }, { $set: req.body })
      .then(() => {
        res.send("patched");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    articleName = req.params.article;
    Article.findOneAndDelete({ title: articleName })
      .then(() => {
        res.send("Deleted the article");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
