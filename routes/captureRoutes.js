const express = require("express");

const db = require("../data/database");

const router = express.Router();

//////////////////// CAPTURE GET ////////////////////

router.get("/capture", async (req, res) => {
  if (!res.locals.isAuth) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }

  const dateFormater = (date, separator) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + separator + month + separator + day;
  };

  const today = new Date();
  const date = dateFormater(today, "-");
  const categories = await db
    .getDb()
    .collection("expenseCategories")
    .find()
    .sort({ title: 1 })
    .toArray();

  const lastThreeTransactions = await db
    .getDb()
    .collection("transactions")
    .find()
    .sort({ _id: -1 })
    .limit(5)
    .toArray();
  res.render("capture", {
    transactions: lastThreeTransactions,
    categories: categories,
    date: date,
    page_name: "capture",
  });
});

//////////////////// CAPTURE POST ////////////////////
router.post("/capture", async (req, res) => {
  const expenseData = req.body;
  const date = new Date(expenseData.date);
  const transactionType = expenseData["transaction-type"];
  const category = expenseData.category;
  const paidBy = expenseData["paid-by"];
  const amount = expenseData.amount;
  const description = expenseData.description;

  const transaction = {
    date: date,
    transactionType: transactionType,
    category: category,
    paidBy: paidBy,
    amount: amount,
    description: description,
  };

  await db.getDb().collection("transactions").insertOne(transaction);

  res.redirect("capture");
});

module.exports = router;
