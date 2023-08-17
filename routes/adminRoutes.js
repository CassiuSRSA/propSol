const express = require("express");

const db = require("../data/database");

const router = express.Router();

//////////////////// ADMIN GET  ////////////////////

router.get("/admin", async (req, res) => {
  if (!res.locals.isAuth) {
    // if (!req.session.user)
    return res.status(401).render("401", { page_name: "" });
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render("403", { page_name: "" });
  }

  const categories = await db
    .getDb()
    .collection("expenseCategories")
    .find()
    .sort({ title: 1 })
    .toArray();

  res.render("admin", { categories: categories, page_name: "admin" });
});

//////////////////// ADD CATEGORY POST  ////////////////////

router.post("/categories/add", async (req, res) => {
  const enteredCategory = req.body["add-category"];
  const htmlReady = enteredCategory.toLowerCase().trim().replaceAll(" ", "-");

  await db
    .getDb()
    .collection("expenseCategories")
    .insertOne({ title: enteredCategory, htmlValue: htmlReady });
  res.redirect("/admin");
});

//////////////////// DELETE CATEGORY POST  ////////////////////

router.post("/categories/delete", async (req, res) => {
  const enteredCategory = req.body["delete-category"];
  await db
    .getDb()
    .collection("expenseCategories")
    .deleteOne({ htmlValue: enteredCategory });

  res.redirect("/admin");
});

module.exports = router;
